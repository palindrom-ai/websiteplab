import { getExportDimensions } from './presets'
import type { DeckParams } from '../page'

const CHARS = '0123456789@#$%&*+=?<>{}[]/\\|LABS'

interface ExportGrid {
  cellX: number
  cellY: number
  char: string
  brightness: number
}

/**
 * Renders the ASCII overlay onto a canvas at export dimensions.
 * Uses a seeded random approach (matching the live preview's grid).
 */
function renderAsciiLayer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  params: DeckParams,
) {
  const ctx = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)

  if (!params.asciiEnabled) return

  const blockSize = params.blockSize * (width / 1920) // Scale block size to export resolution
  const cols = Math.ceil(width / blockSize)
  const rows = Math.ceil(height / blockSize)

  // Deterministic grid seeded from block dimensions
  const grid: ExportGrid[] = []
  const seed = (x: number, y: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
    return h - Math.floor(h)
  }

  for (let cellY = 0; cellY < rows; cellY++) {
    for (let cellX = 0; cellX < cols; cellX++) {
      if (seed(cellX, cellY) < params.asciiDensity) {
        grid.push({
          cellX,
          cellY,
          char: CHARS[Math.floor(seed(cellX + 100, cellY + 100) * CHARS.length)],
          brightness: seed(cellX + 200, cellY + 200) * 0.5 + 0.5,
        })
      }
    }
  }

  // Scale font size proportionally
  const fontSize = Math.max(8, Math.round(14 * (width / 1920)))
  ctx.font = `500 ${fontSize}px "Inter", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const cell of grid) {
    const px = (cell.cellX + 0.5) * blockSize
    const py = height - ((cell.cellY + 0.5) * blockSize) // WebGL Y inversion

    const alpha = params.asciiOpacity * cell.brightness
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.fillText(cell.char, px, py)
  }
}

/**
 * Renders the text overlay onto a canvas at export dimensions.
 */
function renderTextLayer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  params: DeckParams,
) {
  const ctx = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  ctx.clearRect(0, 0, width, height)

  if (!params.textContent.trim()) return

  // Scale font size proportionally to resolution
  const scale = width / 1920
  const fontSize = Math.round(params.textSize * scale)
  const fontFamily = params.textFont === 'mono'
    ? '"SF Mono", "Fira Code", "Consolas", monospace'
    : '"Inter", -apple-system, sans-serif'

  ctx.font = `600 ${fontSize}px ${fontFamily}`
  ctx.fillStyle = params.textColor
  ctx.textBaseline = 'middle'

  // Position
  const pad = Math.round(60 * scale)
  let x: number
  let y: number

  switch (params.textPosition) {
    case 'center':
      ctx.textAlign = 'center'
      x = width / 2
      y = height / 2
      break
    case 'bottom-left':
      ctx.textAlign = 'left'
      x = pad
      y = height - pad
      break
    case 'bottom-right':
      ctx.textAlign = 'right'
      x = width - pad
      y = height - pad
      break
    case 'top-left':
      ctx.textAlign = 'left'
      x = pad
      y = pad + fontSize / 2
      break
    default:
      ctx.textAlign = 'center'
      x = width / 2
      y = height / 2
  }

  ctx.fillText(params.textContent, x, y)
}

/**
 * Renders a film grain layer using random pixel noise.
 * SVG feTurbulence can't be rasterized to canvas directly,
 * so we generate equivalent fractal noise programmatically.
 */
function renderGrainLayer(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  params: DeckParams,
) {
  canvas.width = width
  canvas.height = height
  if (!params.grainEnabled) return

  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  // Generate noise pixels — grayscale random values
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255
    data[i] = v       // R
    data[i + 1] = v   // G
    data[i + 2] = v   // B
    data[i + 3] = Math.round(params.grainOpacity * 255) // A
  }

  ctx.putImageData(imageData, 0, 0)
}

/**
 * Export the deck as a PNG by compositing:
 * 1. WebGL gradient layer (rendered at export resolution)
 * 2. ASCII overlay layer
 * 3. Film grain layer
 * 4. Text overlay layer
 */
export async function exportDeckPNG(
  renderWebGL: (targetCanvas: HTMLCanvasElement, width: number, height: number) => void,
  params: DeckParams,
): Promise<void> {
  const { width, height } = getExportDimensions(params.aspectRatio, params.exportResolution)

  // 1. Render WebGL layer at export resolution
  const glCanvas = document.createElement('canvas')
  renderWebGL(glCanvas, width, height)

  // 2. Render ASCII layer
  const asciiCanvas = document.createElement('canvas')
  renderAsciiLayer(asciiCanvas, width, height, params)

  // 3. Render grain layer
  const grainCanvas = document.createElement('canvas')
  renderGrainLayer(grainCanvas, width, height, params)

  // 4. Render text layer
  const textCanvas = document.createElement('canvas')
  renderTextLayer(textCanvas, width, height, params)

  // 5. Composite onto final canvas
  const finalCanvas = document.createElement('canvas')
  finalCanvas.width = width
  finalCanvas.height = height
  const ctx = finalCanvas.getContext('2d')!

  ctx.drawImage(glCanvas, 0, 0)
  ctx.drawImage(asciiCanvas, 0, 0)
  ctx.drawImage(grainCanvas, 0, 0)
  ctx.drawImage(textCanvas, 0, 0)

  // 5. Trigger download via blob URL (reliable for large canvases)
  const blob = await new Promise<Blob>((resolve, reject) => {
    finalCanvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png')
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = `deck-${params.aspectRatio.replace(':', 'x')}-${params.exportResolution}.png`
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
