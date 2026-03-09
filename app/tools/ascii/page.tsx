'use client';

import { useState, useRef, useCallback, useEffect, DragEvent } from 'react';
import './ascii.css';
import AsciiCanvas, { AsciiCanvasHandle } from './components/AsciiCanvas';
import AsciiControlPanel from './components/AsciiControlPanel';
import { AsciiParams, DEFAULT_ASCII_PARAMS, useAsciiRenderer } from './hooks/useAsciiRenderer';
import { ImageBuffer, loadImageToBuffer } from '@/app/tools/mosaic/utils/imageProcessing';
import { useVideoPlayer, PlaybackQuality } from '@/app/tools/mosaic/hooks/useVideoPlayer';
import { useSubjectMask } from '@/app/tools/mosaic/hooks/useSubjectMask';
import { useVideoExporter, ExportOptions } from '@/app/tools/mosaic/hooks/useVideoExporter';
import { trackSubjectOnFrame } from '@/app/tools/mosaic/utils/samSegmenter';

export default function AsciiToolPage() {
  console.log('[ascii] Page component mounted');
  const [params, setParams] = useState<AsciiParams>(DEFAULT_ASCII_PARAMS);
  const [buffer, setBuffer] = useState<ImageBuffer | null>(null);
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const canvasRef = useRef<AsciiCanvasHandle>(null);

  // Export settings
  const [exportResolution, setExportResolution] = useState<string>('original');
  const [exportQuality, setExportQuality] = useState<number>(80);
  const [playbackQuality, setPlaybackQuality] = useState<PlaybackQuality>('standard');

  // Subject mask
  const {
    mask, points, isLoading, isEncoding, isDecoding,
    initModel, encodeImage, addPoint, removeLastPoint, clearMask, invertMask,
  } = useSubjectMask();

  // Renderer (needed for export render callback)
  const { render } = useAsciiRenderer();

  // Video exporter
  const { exportState, startExport, cancelExport } = useVideoExporter();

  // SAM model initialization tracking
  const modelInitedRef = useRef(false);

  // Clear subject mask when switching mask modes
  const prevMaskModeRef = useRef(params.maskMode);
  useEffect(() => {
    if (prevMaskModeRef.current !== params.maskMode) {
      clearMask();
      prevMaskModeRef.current = params.maskMode;
    }
  }, [params.maskMode, clearMask]);

  // Video frame callback
  const handleVideoFrame = useCallback((frameBuffer: ImageBuffer) => {
    setBuffer(frameBuffer);
  }, []);

  const { state: videoState, loadVideo, togglePlay, seek, getVideoElement } = useVideoPlayer(handleVideoFrame, playbackQuality);

  // Mask locked during video playback in subject/auto mode
  const usesSAM = params.maskMode === 'subject' || params.maskMode === 'auto';
  const isMaskLocked = mediaType === 'video' && videoState.playing && usesSAM;

  // Init SAM model + encode image when entering subject/auto mode
  useEffect(() => {
    if (!usesSAM) return;

    const setup = async () => {
      if (!modelInitedRef.current) {
        await initModel();
        modelInitedRef.current = true;
      }
      if (buffer && !isMaskLocked) {
        await encodeImage(buffer);
      }
    };
    setup().catch(err => {
      console.error('Subject mask setup failed:', err);
    });
  }, [usesSAM, buffer, initModel, encodeImage, isMaskLocked]);

  const handleParamChange = useCallback((partial: Partial<AsciiParams>) => {
    setParams(prev => ({ ...prev, ...partial }));
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    console.log('[ascii] handleImageUpload called with:', file.name, file.type, file.size);
    try {
      clearMask();
      const imgBuffer = await loadImageToBuffer(file);
      console.log('[ascii] Image loaded:', imgBuffer.width, 'x', imgBuffer.height);
      setBuffer(imgBuffer);
      setMediaType('image');
    } catch (err) {
      console.error('[ascii] Image upload failed:', err);
      alert('Failed to load image. Please try a different file.');
    }
  }, [clearMask]);

  const handleVideoUpload = useCallback((file: File) => {
    loadVideo(file);
    setMediaType('video');
  }, [loadVideo]);

  // PNG export for static images
  const handleExportPNG = useCallback(() => {
    canvasRef.current?.exportPNG();
  }, []);

  // Video export with subject tracking on keyframes
  const handleExportVideo = useCallback(async () => {
    const videoElement = getVideoElement();
    if (!videoElement || !buffer) return;

    let outWidth = buffer.width;
    let outHeight = buffer.height;

    if (exportResolution !== 'original') {
      const targetShortSide = exportResolution === '1080p' ? 1080 : 720;
      const longestSide = Math.max(buffer.width, buffer.height);
      if (longestSide > targetShortSide) {
        const scale = targetShortSide / longestSide;
        outWidth = Math.round(buffer.width * scale);
        outHeight = Math.round(buffer.height * scale);
      }
    }

    // H.264 requires even dimensions
    outWidth = outWidth % 2 === 0 ? outWidth : outWidth - 1;
    outHeight = outHeight % 2 === 0 ? outHeight : outHeight - 1;

    const bitrate = Math.round(500_000 + (exportQuality / 100) * 7_500_000);

    // Snapshot params and mask at export time
    const exportParams = { ...params };
    let exportMask: Uint8Array | null = mask ? new Uint8Array(mask) : null;

    // Track subject mask across keyframes during export
    const maskTracker = usesSAM && exportMask
      ? async (frameBuffer: ImageBuffer, frameIndex: number): Promise<Uint8Array | null> => {
          // Re-encode on keyframes (every 30 frames ~1s at 30fps)
          if (frameIndex > 0 && frameIndex % 30 === 0) {
            try {
              const newMask = await trackSubjectOnFrame(
                frameBuffer,
                points.map(p => ({ x: p.x, y: p.y, label: p.label })),
                exportMask!,
                true // forceReencode on keyframes
              );
              if (newMask) {
                exportMask = newMask;
              }
            } catch {
              // Keep previous mask on failure
            }
          }
          return exportMask;
        }
      : undefined;

    const options: ExportOptions = {
      width: outWidth,
      height: outHeight,
      fps: 30,
      bitrate,
      maskTracker,
    };

    const renderFrame = (frameBuffer: ImageBuffer, targetCanvas: HTMLCanvasElement, frameTimeSec: number) => {
      render(targetCanvas, frameBuffer, exportParams, exportMask ?? undefined, frameTimeSec);
    };

    try {
      await startExport(videoElement, renderFrame, options);
    } catch (err) {
      console.error('Video export failed:', err);
      alert(`Export failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [getVideoElement, buffer, exportResolution, exportQuality, params, mask, points, usesSAM, render, startExport]);

  // Smart export: PNG for images, MP4 for videos
  const handleExport = useCallback(() => {
    if (mediaType === 'video') {
      handleExportVideo();
    } else {
      handleExportPNG();
    }
  }, [mediaType, handleExportVideo, handleExportPNG]);

  // Canvas click handler for subject mask
  const handleCanvasClick = useCallback((x: number, y: number, label: 0 | 1) => {
    if (isMaskLocked) return;
    addPoint(x, y, label);
  }, [addPoint, isMaskLocked]);

  // Drag-and-drop
  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else if (file.type.startsWith('video/')) {
      handleVideoUpload(file);
    }
  }, [handleImageUpload, handleVideoUpload]);

  const subjectMaskState = {
    isModelLoading: isLoading,
    isEncoding,
    isDecoding,
    pointCount: points.length,
    hasMask: !!mask,
  };

  return (
    <div className="ascii-tool">
      <main
        className={`ascii-canvas-area ${dragging ? 'ascii-drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AsciiCanvas
          ref={canvasRef}
          buffer={buffer}
          params={params}
          subjectMask={mask}
          onCanvasClick={handleCanvasClick}
          clickPoints={points}
        />
      </main>

      <AsciiControlPanel
        params={params}
        onChange={handleParamChange}
        onImageUpload={handleImageUpload}
        onVideoUpload={handleVideoUpload}
        onExport={handleExport}
        hasMedia={mediaType !== 'none'}
        mediaType={mediaType}
        videoState={mediaType === 'video' ? videoState : undefined}
        onTogglePlay={togglePlay}
        onSeek={seek}
        subjectMaskState={subjectMaskState}
        onUndoClick={removeLastPoint}
        onClearMask={clearMask}
        onInvertMask={invertMask}
        exportState={exportState}
        onCancelExport={cancelExport}
        maskLocked={isMaskLocked}
        exportResolution={exportResolution}
        onExportResolutionChange={setExportResolution}
        exportQuality={exportQuality}
        onExportQualityChange={setExportQuality}
        playbackQuality={playbackQuality}
        onPlaybackQualityChange={setPlaybackQuality}
      />
    </div>
  );
}
