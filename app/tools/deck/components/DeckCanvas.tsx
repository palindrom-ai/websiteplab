'use client'

import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useDeckRenderer, DeckRendererHandle } from '../hooks/useDeckRenderer'
import type { DeckParams } from '../page'

const CHARS = '0123456789@#$%&*+=?<>{}[]/\\|LABS'

export interface DeckCanvasHandle {
  /** Export: renders all layers to an offscreen canvas at target resolution */
  renderToCanvas: DeckRendererHandle['renderToCanvas']
}

interface DeckCanvasProps {
  params: DeckParams
}

/**
 * Four-layer canvas stack:
 * 1. WebGL gradient (managed by useDeckRenderer)
 * 2. ASCII overlay (Canvas 2D)
 * 3. Film grain (Canvas 2D pixel noise with overlay blend)
 * 4. Text overlay (Canvas 2D)
 */
const DeckCanvas = forwardRef<DeckCanvasHandle, DeckCanvasProps>(function DeckCanvas({ params }, ref) {
  const glContainerRef = useRef<HTMLDivElement>(null)
  const asciiCanvasRef = useRef<HTMLCanvasElement>(null)
  const grainCanvasRef = useRef<HTMLCanvasElement>(null)
  const textCanvasRef = useRef<HTMLCanvasElement>(null)
  const gridRef = useRef<{ cellX: number; cellY: number; char: string; brightness: number }[]>([])
  const rafRef = useRef<number>(0)

  const { renderToCanvas } = useDeckRenderer(glContainerRef, {
    colorA: params.colorA,
    colorB: params.colorB,
    blockSize: params.blockSize,
    pixelated: params.pixelated,
    noiseTime: params.noiseTime,
  })

  useImperativeHandle(ref, () => ({ renderToCanvas }), [renderToCanvas])

  // ASCII overlay rendering
  useEffect(() => {
    const canvas = asciiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const hash = (x: number, y: number) => {
      const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123
      return h - Math.floor(h)
    }

    const initGrid = () => {
      const container = canvas.parentElement
      if (!container) return
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width
      canvas.height = height

      const grid: typeof gridRef.current = []
      const cols = Math.ceil(width / params.blockSize)
      const rows = Math.ceil(height / params.blockSize)

      for (let cellY = 0; cellY < rows; cellY++) {
        for (let cellX = 0; cellX < cols; cellX++) {
          if (hash(cellX, cellY) < params.asciiDensity) {
            grid.push({
              cellX,
              cellY,
              char: CHARS[Math.floor(hash(cellX + 100, cellY + 100) * CHARS.length)],
              brightness: hash(cellX + 200, cellY + 200) * 0.5 + 0.5,
            })
          }
        }
      }
      gridRef.current = grid
    }

    initGrid()

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      if (params.asciiEnabled && gridRef.current.length > 0) {
        ctx.font = `500 14px "Inter", sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        for (const cell of gridRef.current) {
          const px = (cell.cellX + 0.5) * params.blockSize
          const py = height - ((cell.cellY + 0.5) * params.blockSize)

          const alpha = params.asciiOpacity * cell.brightness
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.fillText(cell.char, px, py)
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    const ro = new ResizeObserver(() => initGrid())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [params.blockSize, params.asciiEnabled, params.asciiDensity, params.asciiOpacity])

  // Film grain rendering — Canvas 2D pixel noise
  // Noise is rendered at full alpha; CSS opacity controls intensity.
  // This gives mix-blend-mode: overlay full-strength pixels to work with.
  useEffect(() => {
    const canvas = grainCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const container = canvas.parentElement
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return
      canvas.width = width
      canvas.height = height

      ctx.clearRect(0, 0, width, height)

      if (!params.grainEnabled) return

      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255 // Full alpha — CSS opacity handles intensity
      }

      ctx.putImageData(imageData, 0, 0)
    }

    resize()

    const ro = new ResizeObserver(() => resize())
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    return () => ro.disconnect()
  }, [params.grainEnabled])

  // Text overlay rendering
  useEffect(() => {
    const canvas = textCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const container = canvas.parentElement
    if (!container) return
    const width = container.clientWidth
    const height = container.clientHeight
    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)

    if (!params.textContent.trim()) return

    const fontFamily = params.textFont === 'mono'
      ? '"SF Mono", "Fira Code", "Consolas", monospace'
      : '"Inter", -apple-system, sans-serif'

    ctx.font = `600 ${params.textSize}px ${fontFamily}`
    ctx.fillStyle = params.textColor
    ctx.textBaseline = 'middle'

    const pad = 40
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
        y = pad + params.textSize / 2
        break
      default:
        ctx.textAlign = 'center'
        x = width / 2
        y = height / 2
    }

    ctx.fillText(params.textContent, x, y)
  }, [params.textContent, params.textSize, params.textPosition, params.textColor, params.textFont])

  const aspectRatio = params.aspectRatio === '16:9' ? 16 / 9
    : params.aspectRatio === '4:3' ? 4 / 3
    : 1

  return (
    <div className="deck-slide-frame">
      <div
        className="deck-canvas-container"
        style={{
          aspectRatio: `${aspectRatio}`,
        }}
      >
        <div
          ref={glContainerRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <canvas
          ref={asciiCanvasRef}
          className="deck-ascii-canvas"
        />
        <canvas
          ref={grainCanvasRef}
          className="deck-grain-canvas"
          style={{ opacity: params.grainEnabled ? params.grainOpacity : 0 }}
        />
        <canvas
          ref={textCanvasRef}
          className="deck-text-canvas"
        />
      </div>
    </div>
  )
})

export default DeckCanvas
