import { ImageBuffer, sampleColorAt } from './imageProcessing';
import { isOnEffectSide, dilateMask, MosaicParams } from '../hooks/useMosaicRenderer';

// ── Types ──

export interface SurfaceLine {
  points: { x: number; y: number }[];
  color: [number, number, number];
  active: boolean;
}

export interface GapRegion {
  /** Flat array of [x0,y0, x1,y1, ...] gap pixel coordinates */
  coords: Uint16Array;
  count: number;
  /** Flat array of [x0,y0, x1,y1, ...] edge pixel coordinates (gap pixels adjacent to a mosaic cell) */
  edgeCoords: Uint16Array;
  edgeCount: number;
}

export interface SurfaceLineConfig {
  lineCount: number;
  stepDistance: number;
  lineWidth: number;
  glowStrength: number;
  opacity: number;
  duration: number;
}

// ── Gap Region Computation ──

/**
 * Finds gap pixels: pixels where the subject mask is active but no mosaic cell covers them.
 * Also finds edge pixels: gap pixels adjacent to a covered (mosaic cell) pixel.
 */
export function computeGapRegion(
  buffer: ImageBuffer,
  params: MosaicParams,
  subjectMask: Uint8Array | null
): GapRegion {
  const { width, height } = buffer;
  const {
    cellSize, spacing, threshold, invertThreshold,
    maskMode, splitPosition, splitAngle,
    autoBrightnessCutoff, invertAutoMask,
    maskDilation,
  } = params;

  const useSplit = maskMode === 'split';
  const useSubject = maskMode === 'subject' && !!subjectMask;
  const useAuto = maskMode === 'auto';

  // Resolve mask dimensions (handles resolution mismatch)
  let maskW = width, maskH = height;
  if (subjectMask && subjectMask.length !== width * height) {
    maskH = Math.round(Math.sqrt(subjectMask.length * height / width));
    maskW = Math.round(subjectMask.length / maskH);
    if (maskW * maskH !== subjectMask.length) {
      maskH = Math.round(subjectMask.length / maskW);
    }
  }

  // Apply mask dilation
  let effectiveMask = subjectMask;
  if (effectiveMask && maskDilation > 0 && (useSubject || useAuto)) {
    effectiveMask = dilateMask(effectiveMask, maskW, maskH, maskDilation);
  }

  // Bitmap: 1 = covered by a mosaic cell, 0 = not covered
  const covered = new Uint8Array(width * height);

  const step = cellSize * 2 + spacing;
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellX = col * step + cellSize;
      const cellY = row * step + cellSize;
      if (cellX >= width || cellY >= height) continue;

      // Mark the bounding box of this cell as covered
      const x0 = Math.max(0, cellX - cellSize);
      const y0 = Math.max(0, cellY - cellSize);
      const x1 = Math.min(width - 1, cellX + cellSize);
      const y1 = Math.min(height - 1, cellY + cellSize);

      for (let py = y0; py <= y1; py++) {
        for (let px = x0; px <= x1; px++) {
          covered[py * width + px] = 1;
        }
      }
    }
  }

  // Collect gap pixels: mask=1 AND covered=0
  // First pass: count
  let gapCount = 0;
  let edgeCount = 0;

  // We'll do a two-pass approach for efficiency
  // Pass 1: identify all gap pixels
  const isGap = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      // Must be uncovered
      if (covered[idx] === 1) continue;

      // Must pass mask checks (same logic as renderer)
      if (useSplit && !isOnEffectSide(x, y, width, height, splitPosition, splitAngle)) continue;

      if (useSubject && effectiveMask) {
        const mx = Math.round(x * maskW / width);
        const my = Math.round(y * maskH / height);
        const maskIdx = my * maskW + mx;
        if (maskIdx < 0 || maskIdx >= effectiveMask.length || effectiveMask[maskIdx] === 0) continue;
      }

      if (useAuto) {
        const pi = idx * 4;
        const r = buffer.data[pi], g = buffer.data[pi + 1], b = buffer.data[pi + 2];
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const passesBrightness = invertAutoMask
          ? brightness <= autoBrightnessCutoff
          : brightness >= autoBrightnessCutoff;
        if (!passesBrightness) continue;
        if (effectiveMask) {
          const mx = Math.round(x * maskW / width);
          const my = Math.round(y * maskH / height);
          const maskIdx = my * maskW + mx;
          if (maskIdx >= 0 && maskIdx < effectiveMask.length && effectiveMask[maskIdx] === 0) continue;
        }
      }

      // For 'none' mode: all uncovered pixels are gaps (full canvas effect)
      if (maskMode === 'none') {
        // No additional mask check needed
      }

      isGap[idx] = 1;
      gapCount++;
    }
  }

  // Pass 2: collect gap coords and identify edge pixels
  const gapCoordsBuf = new Uint16Array(gapCount * 2);
  const edgeCoordsTemp: number[] = [];
  let gi = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (isGap[y * width + x] !== 1) continue;

      gapCoordsBuf[gi++] = x;
      gapCoordsBuf[gi++] = y;

      // Edge check: is any 4-connected neighbor a covered pixel?
      const isEdge =
        (x > 0 && covered[y * width + (x - 1)] === 1) ||
        (x < width - 1 && covered[y * width + (x + 1)] === 1) ||
        (y > 0 && covered[(y - 1) * width + x] === 1) ||
        (y < height - 1 && covered[(y + 1) * width + x] === 1);

      if (isEdge) {
        edgeCoordsTemp.push(x, y);
        edgeCount++;
      }
    }
  }

  return {
    coords: gapCoordsBuf,
    count: gapCount,
    edgeCoords: new Uint16Array(edgeCoordsTemp),
    edgeCount,
  };
}

// ── Spatial Hash ──

interface SpatialHash {
  cellSize: number;
  cols: number;
  cells: Map<number, number[]>;
}

function buildSpatialHash(
  gapCoords: Uint16Array,
  gapCount: number,
  cellSize: number,
  imgWidth: number
): SpatialHash {
  const cols = Math.ceil(imgWidth / cellSize);
  const cells = new Map<number, number[]>();

  for (let i = 0; i < gapCount; i++) {
    const x = gapCoords[i * 2];
    const y = gapCoords[i * 2 + 1];
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    const key = gy * cols + gx;

    let bucket = cells.get(key);
    if (!bucket) {
      bucket = [];
      cells.set(key, bucket);
    }
    bucket.push(i);
  }

  return { cellSize, cols, cells };
}

// ── Line Initialization & Growth ──

/**
 * Initialize lines from edge coordinates (gap pixels adjacent to mosaic cells).
 * If not enough edge pixels, fall back to random gap pixels.
 */
function initializeLines(
  buffer: ImageBuffer,
  edgeCoords: Uint16Array,
  edgeCount: number,
  gapCoords: Uint16Array,
  gapCount: number,
  lineCount: number
): SurfaceLine[] {
  const lines: SurfaceLine[] = [];
  const count = Math.min(lineCount, Math.max(edgeCount, gapCount));

  // Pseudo-random but deterministic shuffle of edge indices
  const indices: number[] = [];
  if (edgeCount > 0) {
    for (let i = 0; i < edgeCount; i++) indices.push(i);
    // Fisher-Yates with seeded pseudo-random
    for (let i = indices.length - 1; i > 0; i--) {
      const j = ((i * 7919 + 104729) >>> 0) % (i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }

  for (let i = 0; i < count; i++) {
    let x: number, y: number;

    if (i < indices.length) {
      // Pick from shuffled edge pixels
      const ei = indices[i];
      x = edgeCoords[ei * 2];
      y = edgeCoords[ei * 2 + 1];
    } else {
      // Fall back to random gap pixels
      const gi = ((i * 48271 + 13) >>> 0) % gapCount;
      x = gapCoords[gi * 2];
      y = gapCoords[gi * 2 + 1];
    }

    const [r, g, b] = sampleColorAt(buffer, x, y);

    lines.push({
      points: [{ x, y }],
      color: [r, g, b],
      active: true,
    });
  }

  return lines;
}

/**
 * Grow all lines to completion. Each growth step finds the nearest unvisited
 * gap pixel within stepDistance of the line's head.
 */
function growLines(
  lines: SurfaceLine[],
  gapCoords: Uint16Array,
  gapCount: number,
  hash: SpatialHash,
  stepDistance: number,
  buffer: ImageBuffer
): void {
  // Track which gap pixels have been claimed
  const used = new Uint8Array(gapCount);

  // Mark starting points as used
  for (const line of lines) {
    const p = line.points[0];
    const gx = Math.floor(p.x / hash.cellSize);
    const gy = Math.floor(p.y / hash.cellSize);
    const key = gy * hash.cols + gx;
    const bucket = hash.cells.get(key);
    if (bucket) {
      for (const idx of bucket) {
        if (gapCoords[idx * 2] === p.x && gapCoords[idx * 2 + 1] === p.y) {
          used[idx] = 1;
          break;
        }
      }
    }
  }

  const maxStepsPerLine = 500;
  const stepDistSq = stepDistance * stepDistance;
  let anyActive = true;

  while (anyActive) {
    anyActive = false;

    for (const line of lines) {
      if (!line.active) continue;
      if (line.points.length >= maxStepsPerLine) {
        line.active = false;
        continue;
      }

      const head = line.points[line.points.length - 1];
      const hgx = Math.floor(head.x / hash.cellSize);
      const hgy = Math.floor(head.y / hash.cellSize);

      // Search 3x3 neighborhood of grid cells
      let bestIdx = -1;
      let bestDistSq = Infinity;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const key = (hgy + dy) * hash.cols + (hgx + dx);
          const bucket = hash.cells.get(key);
          if (!bucket) continue;

          for (const idx of bucket) {
            if (used[idx]) continue;
            const cx = gapCoords[idx * 2];
            const cy = gapCoords[idx * 2 + 1];
            const dxp = cx - head.x;
            const dyp = cy - head.y;
            const distSq = dxp * dxp + dyp * dyp;

            if (distSq <= stepDistSq && distSq > 0 && distSq < bestDistSq) {
              bestDistSq = distSq;
              bestIdx = idx;
            }
          }
        }
      }

      if (bestIdx >= 0) {
        used[bestIdx] = 1;
        const nx = gapCoords[bestIdx * 2];
        const ny = gapCoords[bestIdx * 2 + 1];
        line.points.push({ x: nx, y: ny });
        // Sample color at new point for per-point color (used in drawing)
        anyActive = true;
      } else {
        line.active = false;
      }
    }
  }
}

// ── Public API ──

/**
 * Computes gap region + grows all surface lines. Returns pre-computed lines
 * ready for progressive-reveal animation.
 */
export function computeSurfaceLines(
  buffer: ImageBuffer,
  params: MosaicParams,
  subjectMask: Uint8Array | null,
  config: SurfaceLineConfig
): { lines: SurfaceLine[]; gapCount: number } {
  const gap = computeGapRegion(buffer, params, subjectMask);

  if (gap.count < 50) {
    return { lines: [], gapCount: gap.count };
  }

  const hash = buildSpatialHash(gap.coords, gap.count, config.stepDistance, buffer.width);

  const lines = initializeLines(
    buffer,
    gap.edgeCoords,
    gap.edgeCount,
    gap.coords,
    gap.count,
    config.lineCount
  );

  growLines(lines, gap.coords, gap.count, hash, config.stepDistance, buffer);

  return { lines, gapCount: gap.count };
}

/**
 * Draw surface lines onto a canvas context with progressive reveal.
 * @param progress 0–1, how much of each line to draw
 */
export function drawSurfaceLines(
  ctx: CanvasRenderingContext2D,
  lines: SurfaceLine[],
  buffer: ImageBuffer,
  config: SurfaceLineConfig,
  progress: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (lines.length === 0 || progress <= 0) return;

  const eased = 1 - Math.pow(1 - Math.min(1, progress), 3); // easeOutCubic

  ctx.lineWidth = config.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Set up glow if enabled
  const glowRadius = Math.round(config.glowStrength * 12);

  for (const line of lines) {
    const pointsToDraw = Math.max(1, Math.floor(line.points.length * eased));
    if (pointsToDraw < 2) continue;

    // Sample color at each point from original image for per-point coloring
    // For performance, use the line's base color + per-point sampling
    const baseColor = line.color;

    ctx.beginPath();
    ctx.moveTo(line.points[0].x, line.points[0].y);

    // Use quadratic curves for smoothness
    for (let i = 1; i < pointsToDraw; i++) {
      const curr = line.points[i];
      const prev = line.points[i - 1];

      if (i < pointsToDraw - 1) {
        const next = line.points[i + 1];
        const cpx = curr.x;
        const cpy = curr.y;
        const ex = (curr.x + next.x) / 2;
        const ey = (curr.y + next.y) / 2;
        ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      } else {
        ctx.lineTo(curr.x, curr.y);
      }
    }

    // Sample midpoint color from image for this line segment
    const midIdx = Math.floor(pointsToDraw / 2);
    const midPt = line.points[Math.min(midIdx, line.points.length - 1)];
    const [mr, mg, mb] = sampleColorAt(buffer, midPt.x, midPt.y);

    ctx.globalAlpha = config.opacity;

    if (glowRadius > 0) {
      ctx.shadowColor = `rgb(${mr},${mg},${mb})`;
      ctx.shadowBlur = glowRadius;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = `rgb(${mr},${mg},${mb})`;
    ctx.stroke();
  }

  // Reset
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}
