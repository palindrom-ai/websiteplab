'use client';

import { useCallback } from 'react';
import {
  AsciiParams, RenderMode, AsciiColorMode, GradientMapping, BgMode, AsciiMaskMode,
  GradientStop, ASCII_BRAND_PALETTES,
} from '../hooks/useAsciiRenderer';
import { ExportState } from '@/app/tools/mosaic/hooks/useVideoExporter';
import { PlaybackQuality } from '@/app/tools/mosaic/hooks/useVideoPlayer';
import { rgbToHex, hexToRgb } from '@/app/tools/mosaic/utils/colorMapping';

interface SubjectMaskState {
  isModelLoading: boolean;
  isEncoding: boolean;
  isDecoding: boolean;
  pointCount: number;
  hasMask: boolean;
}

interface AsciiControlPanelProps {
  params: AsciiParams;
  onChange: (params: Partial<AsciiParams>) => void;
  onImageUpload: (file: File) => void;
  onVideoUpload: (file: File) => void;
  onExport: () => void;
  hasMedia: boolean;
  mediaType?: 'none' | 'image' | 'video';
  videoState?: {
    loaded: boolean;
    playing: boolean;
    currentTime: number;
    duration: number;
  };
  onTogglePlay?: () => void;
  onSeek?: (time: number) => void;
  subjectMaskState?: SubjectMaskState;
  onUndoClick?: () => void;
  onClearMask?: () => void;
  onInvertMask?: () => void;
  exportState?: ExportState;
  onCancelExport?: () => void;
  maskLocked?: boolean;
  exportResolution?: string;
  onExportResolutionChange?: (resolution: string) => void;
  exportQuality?: number;
  onExportQualityChange?: (quality: number) => void;
  playbackQuality?: PlaybackQuality;
  onPlaybackQualityChange?: (quality: PlaybackQuality) => void;
}

function Slider({
  label, value, min, max, step = 1, onChange, suffix = '', disabled = false,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; onChange: (v: number) => void; suffix?: string; disabled?: boolean;
}) {
  return (
    <div className="ascii-slider-group">
      <div className="ascii-slider-label">
        <span>{label}</span>
        <span>{value}{suffix}</span>
      </div>
      <input
        type="range"
        className="ascii-slider"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    </div>
  );
}

function Toggle({
  label, checked, onChange, disabled = false,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <div className="ascii-toggle-row">
      <span>{label}</span>
      <label className="ascii-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="ascii-toggle-track" />
        <div className="ascii-toggle-thumb" />
      </label>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatETA(seconds: number): string {
  if (seconds < 0) return '\u2026';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function AsciiControlPanel({
  params, onChange, onImageUpload, onVideoUpload, onExport, hasMedia,
  mediaType = 'none', videoState, onTogglePlay, onSeek,
  subjectMaskState, onUndoClick, onClearMask, onInvertMask,
  exportState, onCancelExport, maskLocked = false,
  exportResolution = 'original', onExportResolutionChange,
  exportQuality = 80, onExportQualityChange,
  playbackQuality = 'standard', onPlaybackQualityChange,
}: AsciiControlPanelProps) {
  const isExporting = exportState?.exporting ?? false;

  const pickFile = useCallback((accept: string, onFile: (f: File) => void) => {
    console.log('[ascii] pickFile called, isExporting:', isExporting);
    if (isExporting) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      console.log('[ascii] File selected:', file?.name, file?.type);
      if (file) onFile(file);
    };
    input.click();
  }, [isExporting]);

  return (
    <aside className="ascii-sidebar">
      {/* Media Upload */}
      <div className="ascii-section">
        <div className="ascii-section-title">Media</div>
        <div className="ascii-upload-row">
          <button
            className="ascii-upload-btn"
            onClick={() => pickFile('image/jpeg,image/png,image/webp,image/gif', onImageUpload)}
            disabled={isExporting}
          >
            Upload Image
          </button>
          <button
            className="ascii-upload-btn"
            onClick={() => pickFile('video/mp4,video/webm', onVideoUpload)}
            disabled={isExporting}
          >
            Upload Video
          </button>
        </div>

        {/* Video controls */}
        {videoState?.loaded && (
          <div style={{ marginTop: 12 }}>
            <div className="ascii-video-controls">
              <button
                className="ascii-play-btn"
                onClick={onTogglePlay}
                disabled={isExporting}
              >
                {videoState.playing ? '\u23f8' : '\u25b6'}
              </button>
              <input
                type="range"
                className="ascii-slider"
                min={0} max={videoState.duration} step={0.1}
                value={videoState.currentTime}
                onChange={e => onSeek?.(Number(e.target.value))}
                style={{ flex: 1 }}
                disabled={isExporting}
              />
              <span className="ascii-video-time">
                {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
              </span>
            </div>

            {/* Playback Quality */}
            <div style={{ marginTop: 12 }}>
              <div className="ascii-slider-label" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#c4c7d0' }}>Playback Quality</span>
              </div>
              <div className="ascii-mode-toggle">
                {([
                  { key: 'draft' as PlaybackQuality, label: 'Draft', desc: '50% \u00b7 15fps' },
                  { key: 'standard' as PlaybackQuality, label: 'Standard', desc: '75% \u00b7 24fps' },
                  { key: 'full' as PlaybackQuality, label: 'Full', desc: '100% \u00b7 30fps' },
                ] as const).map(preset => (
                  <button
                    key={preset.key}
                    className={`ascii-mode-btn ${playbackQuality === preset.key ? 'active' : ''}`}
                    onClick={() => onPlaybackQualityChange?.(preset.key)}
                    title={preset.desc}
                    disabled={isExporting}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Mode */}
      <div className="ascii-section">
        <div className="ascii-section-title">Render Mode</div>
        <div className="ascii-mode-toggle">
          <button
            className={`ascii-mode-btn ${params.renderMode === 'frosted' ? 'active' : ''}`}
            onClick={() => onChange({ renderMode: 'frosted' as RenderMode })}
            disabled={isExporting}
          >
            Frosted
          </button>
          <button
            className={`ascii-mode-btn ${params.renderMode === 'ascii' ? 'active' : ''}`}
            onClick={() => onChange({ renderMode: 'ascii' as RenderMode })}
            disabled={isExporting}
          >
            ASCII
          </button>
        </div>
      </div>

      {/* Grid Controls */}
      <div className="ascii-section">
        <div className="ascii-section-title">Grid</div>
        <Slider
          label="Cell Size" value={params.cellSize}
          min={2} max={40}
          onChange={v => onChange({ cellSize: v })}
          suffix="px" disabled={isExporting}
        />
        <Slider
          label="Spacing" value={params.spacing}
          min={0} max={20}
          onChange={v => onChange({ spacing: v })}
          suffix="px" disabled={isExporting}
        />
        <div style={{ marginTop: 12 }}>
          <div className="ascii-slider-label" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#c4c7d0' }}>Background</span>
          </div>
          <div className="ascii-bg-selector">
            {(['black', 'white', 'transparent'] as BgMode[]).map(bg => (
              <button
                key={bg}
                className={`ascii-bg-option bg-${bg} ${params.bgMode === bg ? 'active' : ''}`}
                onClick={() => onChange({ bgMode: bg })}
                title={bg}
                disabled={isExporting}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mask Mode */}
      <div className="ascii-section">
        <div className="ascii-section-title">Mask Mode</div>
        <div className="ascii-mode-toggle">
          {(['none', 'subject', 'auto'] as AsciiMaskMode[]).map(mode => (
            <button
              key={mode}
              className={`ascii-mode-btn ${params.maskMode === mode ? 'active' : ''}`}
              onClick={() => onChange({ maskMode: mode })}
              disabled={isExporting}
            >
              {mode === 'none' ? 'None' : mode === 'subject' ? 'Subject' : 'Auto'}
            </button>
          ))}
        </div>

        {/* Subject mask controls */}
        {params.maskMode === 'subject' && (
          <div style={{ marginTop: 8 }}>
            {maskLocked ? (
              <div className="ascii-mask-locked">Mask locked during playback</div>
            ) : (
              <>
                {subjectMaskState?.isModelLoading && (
                  <div className="ascii-mask-status">Loading AI model...</div>
                )}
                {subjectMaskState?.isEncoding && (
                  <div className="ascii-mask-status">Encoding image...</div>
                )}
                {subjectMaskState?.isDecoding && (
                  <div className="ascii-mask-status">Generating mask...</div>
                )}
                {!subjectMaskState?.isModelLoading && !subjectMaskState?.isEncoding && (
                  <div className="ascii-mask-instructions">
                    Left-click to select, right-click to exclude
                  </div>
                )}
              </>
            )}
            <div className="ascii-mask-actions">
              <button className="ascii-mask-btn" onClick={onUndoClick}
                disabled={!subjectMaskState?.pointCount || maskLocked || isExporting}>
                Undo Click
              </button>
              <button className="ascii-mask-btn" onClick={onClearMask}
                disabled={!subjectMaskState?.hasMask || maskLocked || isExporting}>
                Clear Mask
              </button>
              <button className="ascii-mask-btn" onClick={onInvertMask}
                disabled={!subjectMaskState?.hasMask || maskLocked || isExporting}>
                Invert Mask
              </button>
            </div>
            {subjectMaskState?.pointCount && !maskLocked ? (
              <div className="ascii-mask-info">
                {subjectMaskState.pointCount} click{subjectMaskState.pointCount !== 1 ? 's' : ''} placed
              </div>
            ) : null}
          </div>
        )}

        {/* Auto brightness mask controls */}
        {params.maskMode === 'auto' && (
          <div style={{ marginTop: 8 }}>
            <div className="ascii-mask-instructions">
              Auto-selects bright areas. Click to refine.
            </div>
            <Slider
              label="Brightness Cutoff" value={params.autoBrightnessCutoff}
              min={0} max={255}
              onChange={v => onChange({ autoBrightnessCutoff: v })}
              disabled={isExporting}
            />
            <Toggle
              label="Invert (dark areas)"
              checked={params.invertAutoMask}
              onChange={v => onChange({ invertAutoMask: v })}
              disabled={isExporting}
            />
            {subjectMaskState?.isModelLoading && (
              <div className="ascii-mask-status">Loading AI model...</div>
            )}
            {subjectMaskState?.isEncoding && (
              <div className="ascii-mask-status">Encoding image...</div>
            )}
            {maskLocked && (
              <div className="ascii-mask-locked">Mask locked during playback</div>
            )}
            {(subjectMaskState?.pointCount ?? 0) > 0 && (
              <div className="ascii-mask-actions">
                <button className="ascii-mask-btn" onClick={onUndoClick}
                  disabled={!subjectMaskState?.pointCount || maskLocked || isExporting}>
                  Undo Click
                </button>
                <button className="ascii-mask-btn" onClick={onClearMask}
                  disabled={!subjectMaskState?.hasMask || maskLocked || isExporting}>
                  Clear Refinement
                </button>
                <button className="ascii-mask-btn" onClick={onInvertMask}
                  disabled={!subjectMaskState?.hasMask || maskLocked || isExporting}>
                  Invert Mask
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Brightness Threshold */}
      <div className="ascii-section">
        <div className="ascii-section-title">Brightness Threshold</div>
        <Slider
          label="Threshold" value={params.threshold}
          min={0} max={255}
          onChange={v => onChange({ threshold: v })}
          disabled={isExporting}
        />
        <Toggle
          label="Invert"
          checked={params.invertThreshold}
          onChange={v => onChange({ invertThreshold: v })}
          disabled={isExporting}
        />
      </div>

      {/* Color Mapping */}
      <div className="ascii-section">
        <div className="ascii-section-title">Color Mapping</div>
        <div className="ascii-mode-toggle" style={{ marginBottom: 14 }}>
          <button
            className={`ascii-mode-btn ${params.colorMode === 'original' ? 'active' : ''}`}
            onClick={() => onChange({ colorMode: 'original' as AsciiColorMode })}
            disabled={isExporting}
          >
            Original
          </button>
          <button
            className={`ascii-mode-btn ${params.colorMode === 'gradient' ? 'active' : ''}`}
            onClick={() => onChange({ colorMode: 'gradient' as AsciiColorMode })}
            disabled={isExporting}
          >
            Gradient
          </button>
        </div>

        {params.colorMode === 'gradient' && (
          <>
            {/* Gradient Mapping Mode */}
            <div style={{ marginBottom: 14 }}>
              <div className="ascii-slider-label" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#c4c7d0' }}>Mapping</span>
              </div>
              <div className="ascii-mode-toggle">
                <button
                  className={`ascii-mode-btn ${params.gradientMapping === 'brightness' ? 'active' : ''}`}
                  onClick={() => onChange({ gradientMapping: 'brightness' as GradientMapping })}
                  disabled={isExporting}
                  title="Map gradient by pixel brightness"
                >
                  Brightness
                </button>
                <button
                  className={`ascii-mode-btn ${params.gradientMapping === 'spatial' ? 'active' : ''}`}
                  onClick={() => onChange({ gradientMapping: 'spatial' as GradientMapping })}
                  disabled={isExporting}
                  title="Map gradient by position (hero gradient look)"
                >
                  Spatial
                </button>
              </div>
            </div>

            {/* Gradient Angle (spatial mode only) */}
            {params.gradientMapping === 'spatial' && (
              <div style={{ marginBottom: 14 }}>
                <Slider
                  label="Angle" value={params.gradientAngle}
                  min={0} max={360} step={5}
                  onChange={v => onChange({ gradientAngle: v })}
                  suffix="°" disabled={isExporting}
                />
                <div className="ascii-angle-presets">
                  {[
                    { angle: 0, label: '→' },
                    { angle: 45, label: '↘' },
                    { angle: 90, label: '↓' },
                    { angle: 135, label: '↙' },
                    { angle: 180, label: '←' },
                    { angle: 225, label: '↖' },
                    { angle: 270, label: '↑' },
                    { angle: 315, label: '↗' },
                  ].map(preset => (
                    <button
                      key={preset.angle}
                      className={`ascii-angle-btn ${params.gradientAngle === preset.angle ? 'active' : ''}`}
                      onClick={() => onChange({ gradientAngle: preset.angle })}
                      disabled={isExporting}
                      title={`${preset.angle}°`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Influence (spatial mode only) */}
            {params.gradientMapping === 'spatial' && (
              <div style={{ marginBottom: 14 }}>
                <Slider
                  label="Photo Influence"
                  value={Math.round(params.brightnessInfluence * 100)}
                  min={0} max={100} step={5}
                  onChange={v => onChange({ brightnessInfluence: v / 100 })}
                  suffix="%" disabled={isExporting}
                />
                <div style={{ fontSize: 11, color: '#6b7084', marginTop: 4 }}>
                  0% = pure gradient (hero look) · 100% = photo brightness blends in
                </div>
              </div>
            )}

            {/* Brand Palette Swatches */}
            <div className="ascii-palette-grid">
              {ASCII_BRAND_PALETTES.map(palette => {
                const isActive = params.gradientStops.length === palette.stops.length &&
                  palette.stops.every((s, i) =>
                    s.color[0] === params.gradientStops[i]?.color[0] &&
                    s.color[1] === params.gradientStops[i]?.color[1] &&
                    s.color[2] === params.gradientStops[i]?.color[2]
                  );
                const gradientCSS = `linear-gradient(135deg, ${palette.stops.map((s, i) =>
                  `rgb(${s.color.join(',')}) ${Math.round((i / (palette.stops.length - 1)) * 100)}%`
                ).join(', ')})`;

                return (
                  <button
                    key={palette.id}
                    className={`ascii-palette-swatch ${isActive ? 'active' : ''}`}
                    onClick={() => onChange({ gradientStops: palette.stops })}
                    disabled={isExporting}
                    title={palette.label}
                  >
                    <div className="ascii-palette-preview" style={{ background: gradientCSS }} />
                    <span className="ascii-palette-label">{palette.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Gradient Builder */}
            <div className="ascii-gradient-builder">
              <div className="ascii-slider-label" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#6b7084' }}>Custom Stops</span>
              </div>
              {params.gradientStops.map((stop, i) => (
                <div className="ascii-gradient-stop-row" key={i}>
                  <span className="ascii-stop-index">{i + 1}</span>
                  <input
                    type="color"
                    className="ascii-color-picker"
                    value={rgbToHex(...stop.color)}
                    onChange={e => {
                      const newStops = [...params.gradientStops];
                      newStops[i] = { ...newStops[i], color: hexToRgb(e.target.value) };
                      onChange({ gradientStops: newStops });
                    }}
                    disabled={isExporting}
                  />
                  <span className="ascii-color-hex">{rgbToHex(...stop.color)}</span>
                  {/* Move up/down */}
                  <button
                    className="ascii-stop-btn"
                    onClick={() => {
                      if (i === 0) return;
                      const newStops = [...params.gradientStops];
                      [newStops[i - 1], newStops[i]] = [newStops[i], newStops[i - 1]];
                      onChange({ gradientStops: newStops });
                    }}
                    disabled={i === 0 || isExporting}
                    title="Move up"
                  >
                    &uarr;
                  </button>
                  <button
                    className="ascii-stop-btn"
                    onClick={() => {
                      if (i === params.gradientStops.length - 1) return;
                      const newStops = [...params.gradientStops];
                      [newStops[i], newStops[i + 1]] = [newStops[i + 1], newStops[i]];
                      onChange({ gradientStops: newStops });
                    }}
                    disabled={i === params.gradientStops.length - 1 || isExporting}
                    title="Move down"
                  >
                    &darr;
                  </button>
                  {/* Remove (min 2 stops) */}
                  <button
                    className="ascii-stop-btn ascii-stop-remove"
                    onClick={() => {
                      const newStops = params.gradientStops.filter((_, idx) => idx !== i);
                      onChange({ gradientStops: newStops });
                    }}
                    disabled={params.gradientStops.length <= 2 || isExporting}
                    title="Remove stop"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                className="ascii-add-stop-btn"
                onClick={() => {
                  const lastColor = params.gradientStops[params.gradientStops.length - 1]?.color ?? [255, 255, 255];
                  onChange({
                    gradientStops: [
                      ...params.gradientStops,
                      { color: lastColor as [number, number, number], label: `Stop ${params.gradientStops.length + 1}` },
                    ],
                  });
                }}
                disabled={isExporting}
              >
                + Add Stop
              </button>
            </div>
          </>
        )}
      </div>

      {/* ASCII Opacity (frosted mode only) */}
      {params.renderMode === 'frosted' && (
        <div className="ascii-section">
          <div className="ascii-section-title">ASCII Opacity</div>
          <Slider
            label="Opacity"
            value={Math.round(params.asciiOpacity * 100)}
            min={10} max={100}
            onChange={v => onChange({ asciiOpacity: v / 100 })}
            suffix="%" disabled={isExporting}
          />
        </div>
      )}

      {/* Export Settings (video) */}
      {mediaType === 'video' && (
        <div className="ascii-section">
          <div className="ascii-section-title">Export Settings</div>
          <div className="ascii-slider-label" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#c4c7d0' }}>Resolution</span>
          </div>
          <div className="ascii-mode-toggle" style={{ marginBottom: 14 }}>
            {[
              { key: 'original', label: 'Original' },
              { key: '1080p', label: '1080p' },
              { key: '720p', label: '720p' },
            ].map(preset => (
              <button
                key={preset.key}
                className={`ascii-mode-btn ${exportResolution === preset.key ? 'active' : ''}`}
                onClick={() => onExportResolutionChange?.(preset.key)}
                disabled={isExporting}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Slider
            label="Quality" value={exportQuality}
            min={10} max={100} step={5}
            onChange={v => onExportQualityChange?.(v)}
            suffix="%" disabled={isExporting}
          />
        </div>
      )}

      {/* Export */}
      <div className="ascii-section">
        {isExporting && exportState ? (
          <div className="ascii-export-progress">
            <div className="ascii-export-header">
              <span className="ascii-export-label">
                Exporting frame {exportState.currentFrame} / {exportState.totalFrames}
              </span>
              <span className="ascii-export-eta">
                ETA {formatETA(exportState.estimatedTimeLeft)}
              </span>
            </div>
            <div className="ascii-export-bar">
              <div
                className="ascii-export-fill"
                style={{ width: `${Math.round(exportState.progress * 100)}%` }}
              />
            </div>
            <div className="ascii-export-pct">
              {Math.round(exportState.progress * 100)}%
            </div>
            <button className="ascii-export-btn ascii-cancel-btn" onClick={onCancelExport}>
              Cancel Export
            </button>
          </div>
        ) : (
          <button
            className="ascii-export-btn"
            onClick={onExport}
            disabled={!hasMedia}
          >
            {mediaType === 'video' ? 'Export MP4' : 'Export PNG'}
          </button>
        )}
      </div>
    </aside>
  );
}
