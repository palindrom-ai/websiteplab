'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ─────────────────────────────────────────────
   Context Graph — clean hub-and-spoke.
   Nodes sized to fit labels. No text clipping.
   ───────────────────────────────────────────── */

interface GraphNode {
  label: string
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  phase: number
}

interface Particle {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
}

const NODE_DEFS = [
  { label: 'Cortex', radius: 32 },
  { label: 'CRM', radius: 22 },
  { label: 'Support', radius: 26 },
  { label: 'Sales', radius: 22 },
  { label: 'Agents', radius: 24 },
  { label: 'HR', radius: 18 },
  { label: 'Finance', radius: 26 },
  { label: 'DevOps', radius: 26 },
  { label: 'Legal', radius: 22 },
]

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
  [1, 3], [5, 7],
]

export default function ContextGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<GraphNode[]>([])
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)

  const initGraph = useCallback((w: number, h: number) => {
    const cx = w * 0.5
    const cy = h * 0.5
    // Use smaller of width/height but cap orbit so nodes don't escape
    const orbitRadius = Math.min(w * 0.35, h * 0.35, 220)

    const nodes: GraphNode[] = NODE_DEFS.map((def, i) => {
      if (i === 0) {
        return {
          label: def.label,
          x: cx, y: cy,
          baseX: cx, baseY: cy,
          radius: def.radius,
          phase: 0,
        }
      }
      const count = NODE_DEFS.length - 1
      const angle = ((i - 1) / count) * Math.PI * 2 - Math.PI / 2
      const px = cx + Math.cos(angle) * orbitRadius
      const py = cy + Math.sin(angle) * orbitRadius
      return {
        label: def.label,
        x: px, y: py,
        baseX: px, baseY: py,
        radius: def.radius,
        phase: i * 0.9,
      }
    })
    nodesRef.current = nodes

    const particles: Particle[] = []
    for (const [from, to] of EDGES) {
      particles.push({
        fromIdx: from,
        toIdx: to,
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.0008,
      })
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
      initGraph(w, h)
    }

    const draw = () => {
      timeRef.current += 1
      const t = timeRef.current
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const particles = particlesRef.current

      // Very gentle drift
      for (const node of nodes) {
        node.x = node.baseX + Math.sin(t * 0.003 + node.phase) * 1.5
        node.y = node.baseY + Math.cos(t * 0.0025 + node.phase * 1.3) * 1.5
      }

      // Edges
      for (const [fi, ti] of EDGES) {
        const a = nodes[fi]
        const b = nodes[ti]
        const isSpoke = fi === 0 || ti === 0
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = isSpoke
          ? 'rgba(28, 25, 23, 0.07)'
          : 'rgba(28, 25, 23, 0.03)'
        ctx.lineWidth = isSpoke ? 1 : 0.5
        ctx.stroke()
      }

      // Particles
      for (const p of particles) {
        p.progress += p.speed
        if (p.progress > 1) p.progress -= 1

        const a = nodes[p.fromIdx]
        const b = nodes[p.toIdx]
        const px = a.x + (b.x - a.x) * p.progress
        const py = a.y + (b.y - a.y) * p.progress

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(217, 119, 6, 0.45)'
        ctx.fill()
      }

      // Nodes — draw back to front (center last, on top)
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i]
        const isCenter = i === 0

        // Subtle center glow
        if (isCenter) {
          const pulse = 0.5 + 0.3 * Math.sin(t * 0.012)
          const glow = ctx.createRadialGradient(
            node.x, node.y, node.radius,
            node.x, node.y, node.radius + 16 + pulse * 8
          )
          glow.addColorStop(0, 'rgba(217, 119, 6, 0.06)')
          glow.addColorStop(1, 'rgba(217, 119, 6, 0)')
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.radius + 16 + pulse * 8, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        // Circle fill
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = isCenter ? 'rgba(255, 251, 247, 0.92)' : 'rgba(255, 251, 247, 0.8)'
        ctx.fill()
        ctx.strokeStyle = isCenter ? 'rgba(217, 119, 6, 0.25)' : 'rgba(28, 25, 23, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Label — sized to fit
        const fontSize = isCenter ? 13 : 10
        ctx.font = `${isCenter ? 600 : 500} ${fontSize}px 'Inter', sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = isCenter ? '#1C1917' : 'rgba(28, 25, 23, 0.5)'
        ctx.fillText(node.label, node.x, node.y)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [initGraph])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
    />
  )
}
