'use client';

import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, MouseEvent } from 'react';
import { ImageBuffer } from '@/app/tools/mosaic/utils/imageProcessing';
import { AsciiParams } from '../hooks/useAsciiRenderer';
import { useAsciiRenderer } from '../hooks/useAsciiRenderer';

interface ClickPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

interface AsciiCanvasProps {
  buffer: ImageBuffer | null;
  params: AsciiParams;
  subjectMask?: Uint8Array | null;
  onCanvasClick?: (x: number, y: number, label: 0 | 1) => void;
  clickPoints?: ClickPoint[];
}

export interface AsciiCanvasHandle {
  exportPNG: () => void;
}

const AsciiCanvas = forwardRef<AsciiCanvasHandle, AsciiCanvasProps>(
  function AsciiCanvas({ buffer, params, subjectMask, onCanvasClick, clickPoints }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { render, startShimmerLoop, stopShimmerLoop, cleanup } = useAsciiRenderer();

    // Refs to avoid stale closures in the shimmer animation loop
    const bufferRef = useRef<ImageBuffer | null>(null);
    const paramsRef = useRef<AsciiParams>(params);
    const maskRef = useRef<Uint8Array | null | undefined>(subjectMask);

    bufferRef.current = buffer;
    paramsRef.current = params;
    maskRef.current = subjectMask;

    // Re-render when params, buffer, or mask change.
    // Always run shimmer loop for ASCII animation (both modes have shimmer).
    useEffect(() => {
      if (!buffer || !canvasRef.current) return;

      startShimmerLoop(canvasRef.current, bufferRef, paramsRef, maskRef);
      return () => stopShimmerLoop();
    }, [buffer, params, subjectMask, startShimmerLoop, stopShimmerLoop]);

    // Cleanup on unmount
    useEffect(() => cleanup, [cleanup]);

    // Convert CSS click coordinates to image-space coordinates
    const cssToImageCoords = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const canvasAspect = canvas.width / canvas.height;
      const elemAspect = rect.width / rect.height;

      let renderW: number, renderH: number, offsetX: number, offsetY: number;
      if (canvasAspect > elemAspect) {
        renderW = rect.width;
        renderH = rect.width / canvasAspect;
        offsetX = 0;
        offsetY = (rect.height - renderH) / 2;
      } else {
        renderH = rect.height;
        renderW = rect.height * canvasAspect;
        offsetX = (rect.width - renderW) / 2;
        offsetY = 0;
      }

      const cssX = e.clientX - rect.left - offsetX;
      const cssY = e.clientY - rect.top - offsetY;

      if (cssX < 0 || cssX > renderW || cssY < 0 || cssY > renderH) return null;

      const imageX = Math.round((cssX / renderW) * canvas.width);
      const imageY = Math.round((cssY / renderH) * canvas.height);

      return { imageX, imageY, renderW, renderH, offsetX, offsetY };
    }, []);

    const clickEnabled = params.maskMode === 'subject' || params.maskMode === 'auto';

    const handleClick = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
      if (!clickEnabled || !onCanvasClick) return;
      const coords = cssToImageCoords(e);
      if (!coords) return;
      onCanvasClick(coords.imageX, coords.imageY, 1);
    }, [clickEnabled, onCanvasClick, cssToImageCoords]);

    const handleContextMenu = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
      if (!clickEnabled || !onCanvasClick) return;
      e.preventDefault();
      const coords = cssToImageCoords(e);
      if (!coords) return;
      onCanvasClick(coords.imageX, coords.imageY, 0);
    }, [clickEnabled, onCanvasClick, cssToImageCoords]);

    const exportPNG = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `ascii-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, []);

    useImperativeHandle(ref, () => ({ exportPNG }), [exportPNG]);

    // Compute dot positions in CSS space for the point overlay
    const dotPositions = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !buffer || !clickPoints?.length) return [];

      const rect = canvas.getBoundingClientRect();
      const canvasAspect = canvas.width / canvas.height;
      const elemAspect = rect.width / rect.height;

      let renderW: number, renderH: number, offsetX: number, offsetY: number;
      if (canvasAspect > elemAspect) {
        renderW = rect.width;
        renderH = rect.width / canvasAspect;
        offsetX = 0;
        offsetY = (rect.height - renderH) / 2;
      } else {
        renderH = rect.height;
        renderW = rect.height * canvasAspect;
        offsetX = (rect.width - renderW) / 2;
        offsetY = 0;
      }

      return clickPoints.map(p => ({
        left: offsetX + (p.x / canvas.width) * renderW,
        top: offsetY + (p.y / canvas.height) * renderH,
        label: p.label,
      }));
    }, [buffer, clickPoints]);

    const displayStyle: React.CSSProperties = buffer
      ? { width: '100%', height: '100%', objectFit: 'contain' as const }
      : {};

    return (
      <div ref={containerRef} className="ascii-canvas-container">
        {buffer ? (
          <>
            <canvas
              ref={canvasRef}
              style={{
                ...displayStyle,
                cursor: clickEnabled ? 'crosshair' : undefined,
              }}
              onClick={handleClick}
              onContextMenu={handleContextMenu}
            />
            {clickEnabled && clickPoints && clickPoints.length > 0 && (
              <div className="ascii-click-dots">
                {dotPositions().map((dot, i) => (
                  <div
                    key={i}
                    className={`ascii-click-dot ${dot.label === 1 ? 'foreground' : 'background'}`}
                    style={{ left: dot.left, top: dot.top }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="ascii-upload-prompt">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
              <text x="32" y="38" textAnchor="middle" fill="currentColor" fontSize="22" fontFamily="monospace">A</text>
            </svg>
            <p>Drop an image or video here</p>
            <span>Supports JPG, PNG, WebP, MP4, WebM</span>
          </div>
        )}
      </div>
    );
  }
);

export default AsciiCanvas;
