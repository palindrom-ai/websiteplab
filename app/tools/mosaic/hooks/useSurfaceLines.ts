import { useCallback, useRef } from 'react';
import { ImageBuffer } from '../utils/imageProcessing';
import { MosaicParams } from './useMosaicRenderer';
import {
  SurfaceLine,
  SurfaceLineConfig,
  computeSurfaceLines,
  drawSurfaceLines,
} from '../utils/surfaceLineFill';

interface SurfaceLinesState {
  lines: SurfaceLine[];
  gapCount: number;
}

export function useSurfaceLines() {
  const linesRef = useRef<SurfaceLinesState>({ lines: [], gapCount: 0 });
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Start (or restart) the surface line animation.
   * 1. Compute gap region + grow lines (sync, ~5-15ms)
   * 2. Start RAF loop for progressive reveal
   */
  const startAnimation = useCallback((
    overlayCanvas: HTMLCanvasElement,
    buffer: ImageBuffer,
    params: MosaicParams,
    subjectMask: Uint8Array | null
  ) => {
    // Cancel any running animation
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
    overlayRef.current = overlayCanvas;

    // Match overlay to main canvas dimensions
    overlayCanvas.width = buffer.width;
    overlayCanvas.height = buffer.height;

    const config: SurfaceLineConfig = {
      lineCount: params.surfaceLineCount,
      stepDistance: params.surfaceLineStepDistance,
      lineWidth: params.surfaceLineWidth,
      glowStrength: params.surfaceLineGlow,
      opacity: params.surfaceLineOpacity,
      duration: params.surfaceLineDuration,
    };

    // Pre-compute all lines
    const result = computeSurfaceLines(buffer, params, subjectMask, config);
    linesRef.current = result;

    if (result.lines.length === 0) {
      // No gap region or too small — clear overlay and return
      const ctx = overlayCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      return;
    }

    // Start progressive reveal animation
    const duration = params.surfaceLineDuration;
    startTimeRef.current = performance.now();
    isAnimatingRef.current = true;

    const animate = (now: number) => {
      if (!isAnimatingRef.current) return;

      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);

      const ctx = overlayCanvas.getContext('2d');
      if (ctx) {
        drawSurfaceLines(ctx, linesRef.current.lines, buffer, config, progress);
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  /**
   * Stop animation and keep current visual state.
   */
  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
  }, []);

  /**
   * Clear all lines and the overlay canvas.
   */
  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
    linesRef.current = { lines: [], gapCount: 0 };

    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  }, []);

  /**
   * Composite the overlay canvas onto the main canvas for PNG export.
   * Call before exporting, then re-render the main canvas afterward.
   */
  const bakeOntoCanvas = useCallback((mainCanvas: HTMLCanvasElement) => {
    if (!overlayRef.current) return;
    const ctx = mainCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(overlayRef.current, 0, 0);
    }
  }, []);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
  }, []);

  return {
    startAnimation,
    stopAnimation,
    reset,
    bakeOntoCanvas,
    cleanup,
    /** Current gap pixel count — useful for tooltip when too few gaps */
    getGapCount: () => linesRef.current.gapCount,
  };
}
