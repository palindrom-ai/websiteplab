import { useCallback, useRef } from 'react';
import { ImageBuffer, sampleColorAt, getBrightness } from '@/app/tools/mosaic/utils/imageProcessing';
import { multiStopGradientColor, rgbToHsl, hslToRgb } from '@/app/tools/mosaic/utils/colorMapping';
import { drawPixelBlock, drawAsciiChar } from '@/app/tools/mosaic/utils/shapes';
import { adjustBrightness } from '@/app/tools/mosaic/utils/colorMapping';

// ── Types ──

export type RenderMode = 'frosted' | 'ascii';
export type AsciiColorMode = 'original' | 'gradient';
export type GradientMapping = 'brightness' | 'spatial';
export type BgMode = 'black' | 'white' | 'transparent';
export type AsciiMaskMode = 'none' | 'subject' | 'auto';

export interface GradientStop {
  color: [number, number, number];
  label: string;
}

export interface AsciiParams {
  renderMode: RenderMode;
  cellSize: number;        // 2-40
  spacing: number;         // 0-20
  threshold: number;       // 0-255
  invertThreshold: boolean;
  colorMode: AsciiColorMode;
  gradientMapping: GradientMapping;
  gradientAngle: number;   // 0-360 degrees for spatial gradient direction
  gradientStops: GradientStop[];
  bgMode: BgMode;
  asciiOpacity: number;    // 0-1
  maskMode: AsciiMaskMode;
  autoBrightnessCutoff: number;
  invertAutoMask: boolean;
  brightnessInfluence: number; // 0-1: 0=pure gradient (hero look), 1=photo brightness modulates color
}

// ── Brand Palettes (brighter, tuned for Progressionlabs hero aesthetic) ──

export interface BrandPalette {
  id: string;
  label: string;
  stops: GradientStop[];
}

export const ASCII_BRAND_PALETTES: BrandPalette[] = [
  // ── Hero / Brand ──
  {
    id: 'hero-gradient',
    label: 'Hero Gradient',
    stops: [
      { color: [20, 20, 80], label: 'Deep Blue' },
      { color: [50, 50, 255], label: 'Blue' },
      { color: [210, 110, 235], label: 'Orchid' },
      { color: [255, 180, 140], label: 'Salmon' },
      { color: [255, 255, 255], label: 'White' },
    ],
  },
  // ── Salmon ↔ Blue ──
  {
    id: 'salmon-blue',
    label: 'Salmon → Blue',
    stops: [
      { color: [255, 160, 122], label: 'Salmon' },
      { color: [220, 140, 180], label: 'Rose' },
      { color: [140, 140, 220], label: 'Periwinkle' },
      { color: [80, 140, 255], label: 'Light Blue' },
    ],
  },
  // ── White → Dark Blue ──
  {
    id: 'white-darkblue',
    label: 'White → Dark Blue',
    stops: [
      { color: [255, 255, 255], label: 'White' },
      { color: [160, 180, 240], label: 'Light Blue' },
      { color: [60, 80, 200], label: 'Blue' },
      { color: [15, 15, 80], label: 'Dark Blue' },
    ],
  },
  // ── White → Dark Purple ──
  {
    id: 'white-darkpurple',
    label: 'White → Purple',
    stops: [
      { color: [255, 255, 255], label: 'White' },
      { color: [210, 180, 240], label: 'Lavender' },
      { color: [150, 70, 200], label: 'Purple' },
      { color: [50, 15, 80], label: 'Dark Purple' },
    ],
  },
  // ── White → Teal ──
  {
    id: 'white-teal',
    label: 'White → Teal',
    stops: [
      { color: [255, 255, 255], label: 'White' },
      { color: [180, 240, 235], label: 'Pale Teal' },
      { color: [60, 200, 190], label: 'Teal' },
      { color: [10, 80, 80], label: 'Dark Teal' },
    ],
  },
  // ── White → Green ──
  {
    id: 'white-green',
    label: 'White → Green',
    stops: [
      { color: [255, 255, 255], label: 'White' },
      { color: [180, 240, 180], label: 'Mint' },
      { color: [60, 180, 60], label: 'Green' },
      { color: [15, 70, 15], label: 'Dark Green' },
    ],
  },
  // ── Green & Yellow ──
  {
    id: 'green-yellow',
    label: 'Green & Yellow',
    stops: [
      { color: [15, 80, 30], label: 'Dark Green' },
      { color: [60, 180, 60], label: 'Green' },
      { color: [180, 220, 60], label: 'Lime' },
      { color: [255, 240, 80], label: 'Yellow' },
    ],
  },
  // ── Green & Blue ──
  {
    id: 'green-blue',
    label: 'Green & Blue',
    stops: [
      { color: [20, 100, 50], label: 'Forest' },
      { color: [40, 200, 140], label: 'Emerald' },
      { color: [60, 180, 220], label: 'Cyan' },
      { color: [40, 80, 255], label: 'Blue' },
    ],
  },
  // ── Blue & Pink ──
  {
    id: 'blue-pink',
    label: 'Blue & Pink',
    stops: [
      { color: [30, 50, 200], label: 'Blue' },
      { color: [120, 80, 220], label: 'Violet' },
      { color: [220, 100, 200], label: 'Pink' },
      { color: [255, 160, 200], label: 'Light Pink' },
    ],
  },
  // ── Cool Orchid (kept) ──
  {
    id: 'cool-orchid',
    label: 'Cool Orchid',
    stops: [
      { color: [40, 20, 90], label: 'Shadow' },
      { color: [70, 70, 255], label: 'Blue' },
      { color: [210, 110, 235], label: 'Orchid' },
      { color: [230, 210, 250], label: 'Lavender' },
    ],
  },
  // ── Warm Sunset (kept) ──
  {
    id: 'warm-sunset',
    label: 'Warm Sunset',
    stops: [
      { color: [80, 30, 60], label: 'Shadow' },
      { color: [210, 110, 235], label: 'Orchid' },
      { color: [255, 180, 140], label: 'Salmon' },
      { color: [255, 240, 220], label: 'Peach' },
    ],
  },
  // ── Neon Mix (kept) ──
  {
    id: 'neon-mix',
    label: 'Neon Mix',
    stops: [
      { color: [30, 10, 50], label: 'Shadow' },
      { color: [80, 80, 255], label: 'Blue' },
      { color: [220, 120, 240], label: 'Orchid' },
      { color: [255, 180, 140], label: 'Salmon' },
    ],
  },
];

export const DEFAULT_GRADIENT_STOPS: GradientStop[] = ASCII_BRAND_PALETTES[0].stops;

export const DEFAULT_ASCII_PARAMS: AsciiParams = {
  renderMode: 'frosted',
  cellSize: 12,
  spacing: 0,
  threshold: 0,
  invertThreshold: false,
  colorMode: 'gradient',
  gradientMapping: 'spatial',
  gradientAngle: 135,
  gradientStops: DEFAULT_GRADIENT_STOPS,
  bgMode: 'black',
  asciiOpacity: 0.85,
  maskMode: 'none',
  autoBrightnessCutoff: 128,
  invertAutoMask: false,
  brightnessInfluence: 0,
};

// ── ASCII character tiers (same as mosaic shapes.ts) ──

const ASCII_TIERS = [
  [' '],
  ['.', '\u00b7', ',', '`', "'", ':', ';', '-', '~'],
  ['!', '?', '/', '\\', '|', '(', ')', '<', '>', '+', '=', '*', '^', '"'],
  ['a', 'c', 'e', 'o', 'r', 's', 'x', 'z', 'n', 'v', '1', '2', '3', '7', '{', '}', '[', ']'],
  ['A', 'G', 'H', 'K', 'R', 'S', 'Z', '%', '$', '&', '#', '\u00a7', '\u03a3', '\u03a9', '\u03b4'],
  ['@', 'W', 'M', 'B', 'N', 'Q', '\u2588', '\u25a0', '\u2593', '\u2592', '\u2591'],
];

/**
 * Stable per-cell hash for deterministic character selection + phase offsets.
 */
function posHash(x: number, y: number): number {
  return (((x * 6151) + (y * 83497)) >>> 0) / 0xFFFFFFFF;
}

/**
 * Draw an ASCII character in the gradient-mapped color (for pure ASCII mode).
 * Unlike drawAsciiChar which renders white chars with colored glow,
 * this renders the char itself in the mapped color with subtle glow.
 */
function drawAsciiCharColored(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cellSize: number,
  brightness: number,
  opacity: number,
  fillR: number, fillG: number, fillB: number,
  timeSec?: number
): void {
  // Pick density tier (skip tier 0 blank)
  const tierIdx = Math.min(
    ASCII_TIERS.length - 1,
    Math.max(1, Math.floor((1 - brightness / 255) * ASCII_TIERS.length))
  );
  const tier = ASCII_TIERS[tierIdx];
  const hash = ((cx * 7919) + (cy * 104729)) >>> 0;
  const char = tier[hash % tier.length];

  const fontSize = Math.max(8, cellSize * 1.6);
  ctx.font = `bold ${fontSize}px "SF Mono", "Fira Code", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let effectiveOpacity = opacity;
  let glowBlur = cellSize * 0.5;
  let glowAlpha = 0.6;

  // Shimmer animation
  if (timeSec !== undefined) {
    const phase = posHash(cx + 1, cy + 1) * Math.PI * 2;
    const pulse = 0.5 + 0.5 * Math.sin(timeSec * 2.5 + phase);
    glowAlpha = 0.2 + 0.6 * pulse;
    glowBlur = 2 + 10 * pulse;
    effectiveOpacity = opacity * (0.5 + 0.5 * pulse);
  }

  // Brighten the fill color for the glow
  const [glowR, glowG, glowB] = adjustBrightness(fillR, fillG, fillB, 1.5);
  ctx.shadowColor = `rgba(${glowR}, ${glowG}, ${glowB}, ${glowAlpha})`;
  ctx.shadowBlur = glowBlur;

  // Colored fill (the character itself is in the mapped color)
  ctx.fillStyle = `rgba(${fillR}, ${fillG}, ${fillB}, ${effectiveOpacity})`;
  ctx.fillText(char, cx, cy);

  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// ── Lazy grain texture ──

let _grainCanvas: HTMLCanvasElement | null = null;
function getGrainCanvas(): HTMLCanvasElement {
  if (!_grainCanvas) {
    _grainCanvas = document.createElement('canvas');
    _grainCanvas.width = 128;
    _grainCanvas.height = 128;
    const gCtx = _grainCanvas.getContext('2d')!;
    const data = gCtx.createImageData(128, 128);
    for (let i = 0; i < data.data.length; i += 4) {
      const v = Math.random() * 255;
      data.data[i] = v;
      data.data[i + 1] = v;
      data.data[i + 2] = v;
      data.data[i + 3] = 255;
    }
    gCtx.putImageData(data, 0, 0);
  }
  return _grainCanvas;
}

// ── Spatial Gradient Helpers ──

interface SpatialGradientBounds {
  gdx: number;   // gradient direction X component
  gdy: number;   // gradient direction Y component
  projMin: number;
  projRange: number; // projMax - projMin (avoid division in hot loop)
}

/**
 * Precompute the projection bounds for a spatial gradient across the full image.
 * We project all 4 corners onto the gradient direction vector and find min/max.
 */
function computeSpatialBounds(width: number, height: number, angleDeg: number): SpatialGradientBounds {
  const rad = angleDeg * Math.PI / 180;
  const gdx = Math.cos(rad);
  const gdy = Math.sin(rad);

  // Project corners
  const p0 = 0;                        // (0,0)
  const p1 = width * gdx;              // (width, 0)
  const p2 = height * gdy;             // (0, height)
  const p3 = width * gdx + height * gdy; // (width, height)

  const projMin = Math.min(p0, p1, p2, p3);
  const projMax = Math.max(p0, p1, p2, p3);
  const projRange = projMax - projMin || 1; // avoid division by zero

  return { gdx, gdy, projMin, projRange };
}

/**
 * Get the spatial gradient 0-1 position for a point (x, y).
 */
function spatialT(x: number, y: number, bounds: SpatialGradientBounds): number {
  const proj = x * bounds.gdx + y * bounds.gdy;
  return Math.max(0, Math.min(1, (proj - bounds.projMin) / bounds.projRange));
}

/**
 * Apply frosted glass treatment to an RGB color:
 * slight desaturation + lightness push, matching drawPixelBlock(soft=true).
 */
function frostedColor(r: number, g: number, b: number): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  const softL = l + (1 - l) * 0.2;
  const softS = s * 0.85;
  return hslToRgb(h, softS, softL);
}

/**
 * Modulate a spatial gradient color by source-image brightness.
 * Darker image areas darken the gradient color; brighter areas keep it vivid.
 * Uses HSL lightness blending to preserve hue.
 */
function brightnessModulate(
  r: number, g: number, b: number, brightness: number
): [number, number, number] {
  const [h, s, l] = rgbToHsl(r, g, b);
  // Map brightness 0-255 → factor 0.15-1.0 (never fully black — preserve some color)
  const factor = 0.15 + 0.85 * (brightness / 255);
  const modulatedL = l * factor;
  return hslToRgb(h, s, modulatedL);
}

/**
 * Map image brightness to an alpha value for the gradient stencil effect.
 * Bright areas → high alpha (vivid gradient), dark areas → low alpha (fades out).
 */
function brightnessToAlpha(brightness: number, min = 0.08, max = 0.95): number {
  return min + (max - min) * (brightness / 255);
}

/**
 * Compute final color and alpha for a spatial gradient pixel.
 * - brightnessInfluence=0: pure gradient color, brightness→alpha only (hero look)
 * - brightnessInfluence=1: brightness modulates color, fixed alpha (old behavior)
 * Blends smoothly between the two modes.
 */
function spatialColorAndAlpha(
  gradR: number, gradG: number, gradB: number,
  brightness: number,
  brightnessInfluence: number
): { r: number; g: number; b: number; alpha: number } {
  // Pure gradient path (influence=0): color untouched, brightness→alpha
  const pureAlpha = brightnessToAlpha(brightness);

  // Modulated path (influence=1): color darkened, alpha fixed
  const [modR, modG, modB] = brightnessModulate(gradR, gradG, gradB, brightness);
  const modAlpha = 0.55 + 0.40 * (brightness / 255);

  // Blend between the two based on influence
  const inv = 1 - brightnessInfluence;
  return {
    r: Math.round(gradR * inv + modR * brightnessInfluence),
    g: Math.round(gradG * inv + modG * brightnessInfluence),
    b: Math.round(gradB * inv + modB * brightnessInfluence),
    alpha: pureAlpha * inv + modAlpha * brightnessInfluence,
  };
}

/**
 * Draw a frosted-glass pixel block with a per-pixel internal gradient.
 * When the gradient color varies significantly across the block, renders a
 * mini-gradient within the block using createLinearGradient. Otherwise falls
 * back to a solid fill for performance.
 */
function drawPixelBlockSpatialGradient(
  ctx: CanvasRenderingContext2D,
  x: number,       // top-left x
  y: number,       // top-left y
  size: number,
  bounds: SpatialGradientBounds,
  gradientColors: [number, number, number][], // raw gradient stop colors
  brightness: number,
  brightnessInfluence: number
): void {
  // Sample gradient at the block's leading and trailing edges along the gradient direction
  const cx = x + size / 2;
  const cy = y + size / 2;

  // Compute t at the two extremes of this block along the gradient axis
  const halfDiag = size * 0.5;
  const tCenter = spatialT(cx, cy, bounds);
  const tDelta = (halfDiag * (Math.abs(bounds.gdx) + Math.abs(bounds.gdy))) / bounds.projRange;
  const tStart = Math.max(0, Math.min(1, tCenter - tDelta));
  const tEnd = Math.max(0, Math.min(1, tCenter + tDelta));

  // If the t range is too small, use solid fill (saves perf)
  if (tEnd - tStart < 0.01) {
    const [gr, gg, gb] = multiStopGradientColor(tCenter * 255, gradientColors);
    const ca = spatialColorAndAlpha(gr, gg, gb, brightness, brightnessInfluence);
    const [fr, fg, fb] = frostedColor(ca.r, ca.g, ca.b);
    ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${ca.alpha})`;
    ctx.fillRect(x, y, size, size);
    return;
  }

  // Compute colors at start and end of the block
  const [sr, sg, sb] = multiStopGradientColor(tStart * 255, gradientColors);
  const [er, eg, eb] = multiStopGradientColor(tEnd * 255, gradientColors);

  // Apply stencil color+alpha + frosted glass treatment
  const startCA = spatialColorAndAlpha(sr, sg, sb, brightness, brightnessInfluence);
  const endCA = spatialColorAndAlpha(er, eg, eb, brightness, brightnessInfluence);
  const [fsr, fsg, fsb] = frostedColor(startCA.r, startCA.g, startCA.b);
  const [fer, feg, feb] = frostedColor(endCA.r, endCA.g, endCA.b);
  // Use averaged alpha for both stops (alpha is uniform across the block)
  const blockAlpha = (startCA.alpha + endCA.alpha) / 2;

  // Create a linear gradient within this block, aligned to the spatial gradient direction
  const gx0 = cx - halfDiag * bounds.gdx;
  const gy0 = cy - halfDiag * bounds.gdy;
  const gx1 = cx + halfDiag * bounds.gdx;
  const gy1 = cy + halfDiag * bounds.gdy;

  const grad = ctx.createLinearGradient(gx0, gy0, gx1, gy1);
  grad.addColorStop(0, `rgba(${fsr}, ${fsg}, ${fsb}, ${blockAlpha})`);
  grad.addColorStop(1, `rgba(${fer}, ${feg}, ${feb}, ${blockAlpha})`);

  ctx.fillStyle = grad;
  ctx.fillRect(x, y, size, size);
}

// ── Hook ──

export function useAsciiRenderer() {
  const rafId = useRef<number>(0);
  const shimmerRafId = useRef<number>(0);

  const render = useCallback((
    canvas: HTMLCanvasElement,
    buffer: ImageBuffer,
    params: AsciiParams,
    subjectMask?: Uint8Array | null,
    timeSec?: number
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = buffer;
    canvas.width = width;
    canvas.height = height;

    const {
      renderMode, cellSize, spacing, threshold, invertThreshold,
      colorMode, gradientMapping, gradientAngle, gradientStops, bgMode, asciiOpacity,
      maskMode, autoBrightnessCutoff, invertAutoMask,
    } = params;

    // Precompute spatial gradient bounds when using spatial mapping
    const useSpatial = colorMode === 'gradient' && gradientMapping === 'spatial';
    const spatialBounds = useSpatial ? computeSpatialBounds(width, height, gradientAngle) : null;
    const gradientColorArray = gradientStops.map(s => s.color);

    const useSubject = maskMode === 'subject' && !!subjectMask;
    const useAuto = maskMode === 'auto';

    // Compute mask lookup dimensions (handles resolution mismatch)
    let maskW = width, maskH = height;
    if (subjectMask && subjectMask.length !== width * height) {
      maskH = Math.round(Math.sqrt(subjectMask.length * height / width));
      maskW = Math.round(subjectMask.length / maskH);
      if (maskW * maskH !== subjectMask.length) {
        maskH = Math.round(subjectMask.length / maskW);
      }
    }

    // Step 1: Draw original image as base layer
    const offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext('2d')!;
    const imgData = new ImageData(
      new Uint8ClampedArray(buffer.data),
      width,
      height
    );
    offCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(offscreen, 0, 0);

    // Step 2: Grid setup
    const step = cellSize * 2 + spacing;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    // For 'none' mask mode, fill background over entire canvas
    if (!useSubject && !useAuto) {
      if (bgMode !== 'transparent') {
        ctx.fillStyle = bgMode === 'black' ? '#000' : '#fff';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    // Collect ASCII cells for second pass (frosted mode)
    const asciiCells: { cx: number; cy: number; brightness: number; fillR: number; fillG: number; fillB: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = col * step + cellSize;
        const cellY = row * step + cellSize;

        if (cellX >= width || cellY >= height) continue;

        // Subject mask check
        if (useSubject) {
          const mx = Math.round(cellX * maskW / width);
          const my = Math.round(cellY * maskH / height);
          const maskIdx = my * maskW + mx;
          if (maskIdx < 0 || maskIdx >= subjectMask.length || subjectMask[maskIdx] === 0) continue;
        }

        const [r, g, b] = sampleColorAt(buffer, cellX, cellY);
        const brightness = getBrightness(r, g, b);

        // Auto brightness mask
        if (useAuto) {
          const passesBrightness = invertAutoMask
            ? brightness <= autoBrightnessCutoff
            : brightness >= autoBrightnessCutoff;
          if (!passesBrightness) continue;

          if (subjectMask) {
            const mx = Math.round(cellX * maskW / width);
            const my = Math.round(cellY * maskH / height);
            const maskIdx = my * maskW + mx;
            if (maskIdx >= 0 && maskIdx < subjectMask.length && subjectMask[maskIdx] === 0) continue;
          }
        }

        // Threshold check
        const passesThreshold = invertThreshold
          ? brightness <= threshold
          : brightness >= threshold;

        if (!passesThreshold && threshold > 0) continue;

        // Per-cell background (in subject/auto mode)
        if (useSubject || useAuto) {
          if (bgMode !== 'transparent') {
            ctx.fillStyle = bgMode === 'black' ? '#000' : '#fff';
            ctx.fillRect(
              cellX - cellSize - spacing / 2,
              cellY - cellSize - spacing / 2,
              cellSize * 2 + spacing,
              cellSize * 2 + spacing
            );
          }
        }

        // Determine fill color and draw the block
        if (useSpatial && spatialBounds) {
          // ── Spatial gradient mode: color from position, stenciled by brightness ──
          const tCenter = spatialT(cellX, cellY, spatialBounds);
          const [gr, gg, gb] = multiStopGradientColor(tCenter * 255, gradientColorArray);

          // Subject mask optimization: when influence=0 and mask is active,
          // the mask provides clean edges so use full brightness for vivid gradient
          const effectiveBrightness = (useSubject && params.brightnessInfluence === 0)
            ? 255 : brightness;

          const ca = spatialColorAndAlpha(gr, gg, gb, effectiveBrightness, params.brightnessInfluence);

          if (renderMode === 'frosted') {
            // Per-pixel internal gradient for frosted glass blocks
            drawPixelBlockSpatialGradient(
              ctx, cellX - cellSize, cellY - cellSize, cellSize * 2,
              spatialBounds, gradientColorArray, effectiveBrightness, params.brightnessInfluence
            );
            asciiCells.push({ cx: cellX, cy: cellY, brightness, fillR: ca.r, fillG: ca.g, fillB: ca.b });
          } else {
            drawAsciiCharColored(ctx, cellX, cellY, cellSize, brightness, asciiOpacity, ca.r, ca.g, ca.b, timeSec);
          }
        } else {
          // ── Brightness gradient or original color mode ──
          let fillR = r, fillG = g, fillB = b;
          if (colorMode === 'gradient') {
            [fillR, fillG, fillB] = multiStopGradientColor(brightness, gradientColorArray);
          }

          if (renderMode === 'frosted') {
            drawPixelBlock(ctx, cellX - cellSize, cellY - cellSize, cellSize * 2, fillR, fillG, fillB, false, true, brightness);
            asciiCells.push({ cx: cellX, cy: cellY, brightness, fillR, fillG, fillB });
          } else {
            drawAsciiCharColored(ctx, cellX, cellY, cellSize, brightness, asciiOpacity, fillR, fillG, fillB, timeSec);
          }
        }
      }
    }

    // ASCII second pass for frosted mode (shimmer overlay)
    if (renderMode === 'frosted') {
      for (const cell of asciiCells) {
        drawAsciiChar(ctx, cell.cx, cell.cy, cellSize, cell.brightness, asciiOpacity,
          cell.fillR, cell.fillG, cell.fillB, timeSec);
      }
    }

    // Film grain overlay (gradient mode)
    if (colorMode === 'gradient') {
      ctx.save();
      ctx.globalAlpha = 0.045;
      ctx.globalCompositeOperation = 'overlay';
      const grainPattern = ctx.createPattern(getGrainCanvas(), 'repeat');
      if (grainPattern) {
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    }
  }, []);

  const renderAnimated = useCallback((
    canvas: HTMLCanvasElement,
    buffer: ImageBuffer,
    params: AsciiParams,
    subjectMask?: Uint8Array | null
  ) => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      render(canvas, buffer, params, subjectMask);
    });
  }, [render]);

  /**
   * Starts a continuous rAF loop for shimmer animation.
   * Always runs (frosted mode has shimmer, ASCII mode has shimmer too).
   * Reads from refs so slider changes take effect on the next frame.
   */
  const startShimmerLoop = useCallback((
    canvas: HTMLCanvasElement,
    bufferRef: React.RefObject<ImageBuffer | null>,
    paramsRef: React.RefObject<AsciiParams>,
    maskRef: React.RefObject<Uint8Array | null | undefined>
  ) => {
    cancelAnimationFrame(shimmerRafId.current);

    const loop = () => {
      const buf = bufferRef.current;
      const p = paramsRef.current;
      if (buf && p) {
        const timeSec = performance.now() / 1000;
        render(canvas, buf, p, maskRef.current ?? undefined, timeSec);
      }
      shimmerRafId.current = requestAnimationFrame(loop);
    };
    shimmerRafId.current = requestAnimationFrame(loop);
  }, [render]);

  const stopShimmerLoop = useCallback(() => {
    cancelAnimationFrame(shimmerRafId.current);
    shimmerRafId.current = 0;
  }, []);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    cancelAnimationFrame(shimmerRafId.current);
  }, []);

  return { render, renderAnimated, startShimmerLoop, stopShimmerLoop, cleanup };
}
