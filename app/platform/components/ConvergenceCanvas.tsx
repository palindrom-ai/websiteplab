'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────────────────────────────
   Convergence Animation — many chaotic data
   streams converge through a single Cortex
   filter point, emerging as clean output.
   ───────────────────────────────────────────── */

interface StreamLine {
  startY: number      // Y position at left edge (spread out)
  cp1x: number        // Bezier control point 1
  cp1y: number
  cp2x: number        // Bezier control point 2
  cp2y: number
  color: string
  noisePhase: number  // For left-side jitter
  noiseAmp: number
}

interface Particle {
  lineIdx: number
  t: number           // 0→1 parametric position along the bezier
  speed: number
}

const LINE_COLORS = [
  'rgba(120, 80, 40, 0.25)',
  'rgba(140, 90, 50, 0.2)',
  'rgba(100, 70, 35, 0.22)',
  'rgba(160, 100, 55, 0.18)',
  'rgba(130, 85, 45, 0.2)',
  'rgba(110, 75, 40, 0.22)',
]

const NUM_LINES = 15

/** Evaluate cubic bezier at parameter t */
function bezierPoint(
  t: number,
  p0x: number, p0y: number,
  p1x: number, p1y: number,
  p2x: number, p2y: number,
  p3x: number, p3y: number
): [number, number] {
  const mt = 1 - t
  const mt2 = mt * mt
  const mt3 = mt2 * mt
  const t2 = t * t
  const t3 = t2 * t
  return [
    mt3 * p0x + 3 * mt2 * t * p1x + 3 * mt * t2 * p2x + t3 * p3x,
    mt3 * p0y + 3 * mt2 * t * p1y + 3 * mt * t2 * p2y + t3 * p3y,
  ]
}

export default function ConvergenceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const linesRef = useRef<StreamLine[]>([])
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const timeRef = useRef(0)
  const convergeRef = useRef({ x: 0, y: 0 })

  const initLines = useCallback((w: number, h: number) => {
    // Convergence point — right-center area
    const cx = w * 0.72
    const cy = h * 0.5
    convergeRef.current = { x: cx, y: cy }

    const lines: StreamLine[] = []
    for (let i = 0; i < NUM_LINES; i++) {
      // Start points spread vertically along left edge
      const ratio = i / (NUM_LINES - 1)
      const startY = h * 0.1 + ratio * h * 0.8

      // Control points create varied arcs — fan out in the middle
      const spreadFactor = (ratio - 0.5) * 2 // -1 to 1
      const arcHeight = spreadFactor * h * 0.35

      lines.push({
        startY,
        cp1x: w * 0.2,
        cp1y: startY + arcHeight * 0.8,
        cp2x: w * 0.5,
        cp2y: cy + arcHeight * 0.3,
        color: LINE_COLORS[i % LINE_COLORS.length],
        noisePhase: Math.random() * Math.PI * 2,
        noiseAmp: 3 + Math.random() * 4,
      })
    }
    linesRef.current = lines

    // Particles on each line
    const particles: Particle[] = []
    for (let i = 0; i < NUM_LINES; i++) {
      // 2 particles per line, staggered
      particles.push({
        lineIdx: i,
        t: Math.random(),
        speed: 0.001 + Math.random() * 0.0015,
      })
      if (Math.random() > 0.4) {
        particles.push({
          lineIdx: i,
          t: Math.random(),
          speed: 0.0008 + Math.random() * 0.001,
        })
      }
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let w = 0, h = 0

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initLines(w, h)
    }

    const draw = () => {
      timeRef.current += 1
      const t = timeRef.current
      ctx.clearRect(0, 0, w, h)

      const lines = linesRef.current
      const particles = particlesRef.current
      const { x: cx, y: cy } = convergeRef.current

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Draw each stream line — glow pass first, then crisp line on top
      for (const line of lines) {
        const noiseY = Math.sin(t * 0.02 + line.noisePhase) * line.noiseAmp

        // Glow pass — wider, blurred
        ctx.save()
        ctx.shadowColor = 'rgba(217, 119, 6, 0.15)'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(0, line.startY + noiseY)
        ctx.bezierCurveTo(
          line.cp1x, line.cp1y + noiseY * 0.5,
          line.cp2x, line.cp2y + noiseY * 0.15,
          cx, cy
        )
        ctx.strokeStyle = 'rgba(180, 120, 50, 0.08)'
        ctx.lineWidth = 4
        ctx.stroke()
        ctx.restore()

        // Crisp line on top
        ctx.beginPath()
        ctx.moveTo(0, line.startY + noiseY)
        ctx.bezierCurveTo(
          line.cp1x, line.cp1y + noiseY * 0.5,
          line.cp2x, line.cp2y + noiseY * 0.15,
          cx, cy
        )
        ctx.strokeStyle = line.color
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // Clean output line — glowing, more prominent
      ctx.save()
      ctx.shadowColor = 'rgba(217, 119, 6, 0.25)'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(w, cy)
      ctx.strokeStyle = 'rgba(160, 100, 40, 0.35)'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.restore()

      // Crisp output line
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(w, cy)
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.2)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Convergence point — amber glow + pulse
      const pulse = 0.5 + 0.3 * Math.sin(t * 0.015)
      const glowRadius = 28 + pulse * 12
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
      glow.addColorStop(0, 'rgba(217, 119, 6, 0.25)')
      glow.addColorStop(0.4, 'rgba(217, 119, 6, 0.1)')
      glow.addColorStop(1, 'rgba(217, 119, 6, 0)')
      ctx.beginPath()
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Core dot
      ctx.beginPath()
      ctx.arc(cx, cy, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 251, 247, 0.95)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)'
      ctx.lineWidth = 2
      ctx.stroke()

      // "Cortex" label
      ctx.font = "600 11px 'Inter', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(28, 25, 23, 0.6)'
      ctx.fillText('Cortex', cx, cy - 16)

      // Animate particles along lines
      for (const p of particles) {
        p.t += p.speed
        if (p.t > 1) p.t -= 1

        const line = lines[p.lineIdx]
        const noiseY = Math.sin(t * 0.02 + line.noisePhase) * line.noiseAmp

        // Evaluate bezier at parameter t
        const [px, py] = bezierPoint(
          p.t,
          0, line.startY + noiseY,
          line.cp1x, line.cp1y + noiseY * 0.5,
          line.cp2x, line.cp2y + noiseY * 0.15,
          cx, cy
        )

        // Particle gets brighter + larger as it approaches convergence
        const brightness = 0.5 + p.t * 0.5
        const radius = 2 + p.t * 1.5

        // Particle glow
        ctx.save()
        ctx.shadowColor = `rgba(217, 119, 6, ${brightness * 0.6})`
        ctx.shadowBlur = 6 + p.t * 4
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217, 119, 6, ${brightness})`
        ctx.fill()
        ctx.restore()
      }

      // Particles on the clean output line (right side)
      const outputParticleX = cx + ((t * 0.5) % (w - cx))
      ctx.beginPath()
      ctx.arc(outputParticleX, cy, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(217, 119, 6, 0.5)'
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [initLines])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
    />
  )
}
