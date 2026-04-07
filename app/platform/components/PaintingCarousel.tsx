'use client'

import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────
   Cycling impressionist "paintings" — rich CSS
   gradient compositions that crossfade every 8s.
   Inspired by Monet, Turner, Rothko color fields.
   ───────────────────────────────────────────── */

const PAINTINGS = [
  // 1. "Turner Sunset" — warm oranges, peach clouds, teal sky edges
  {
    name: 'sunset',
    gradient: `
      radial-gradient(ellipse 80% 60% at 50% 70%, rgba(240, 150, 80, 0.7) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 50% 85%, rgba(245, 200, 150, 0.6) 0%, transparent 50%),
      radial-gradient(ellipse 50% 50% at 30% 30%, rgba(120, 175, 160, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 75% 25%, rgba(130, 180, 165, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse 100% 50% at 50% 60%, rgba(230, 140, 90, 0.5) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 50% 90%, rgba(255, 230, 190, 0.5) 0%, transparent 40%),
      linear-gradient(180deg, #8BB0A0 0%, #D4976A 30%, #E8A870 50%, #DDA06A 70%, #C49060 100%)
    `,
  },
  // 2. "Monet Water Lilies" — soft greens, lilac, pink reflections
  {
    name: 'lilies',
    gradient: `
      radial-gradient(ellipse 60% 50% at 25% 60%, rgba(160, 190, 140, 0.5) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 70% 40%, rgba(190, 160, 200, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 50% 35% at 50% 75%, rgba(210, 170, 180, 0.35) 0%, transparent 45%),
      radial-gradient(ellipse 30% 30% at 80% 70%, rgba(200, 180, 210, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse 40% 30% at 20% 30%, rgba(170, 200, 160, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 90% 70% at 50% 50%, rgba(185, 195, 175, 0.3) 0%, transparent 70%),
      linear-gradient(170deg, #B5C8A8 0%, #C4BBA8 25%, #D0C0B0 45%, #C8B8C0 65%, #B0C0A8 100%)
    `,
  },
  // 3. "Golden Hour" — warm amber, honey gold, dusty rose horizon
  {
    name: 'golden',
    gradient: `
      radial-gradient(ellipse 70% 50% at 40% 45%, rgba(235, 180, 100, 0.6) 0%, transparent 55%),
      radial-gradient(ellipse 50% 60% at 65% 65%, rgba(220, 160, 110, 0.45) 0%, transparent 50%),
      radial-gradient(ellipse 60% 40% at 50% 90%, rgba(200, 140, 130, 0.35) 0%, transparent 45%),
      radial-gradient(ellipse 40% 35% at 15% 50%, rgba(240, 200, 140, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 45% 40% at 85% 35%, rgba(245, 215, 160, 0.35) 0%, transparent 45%),
      radial-gradient(ellipse 100% 80% at 50% 50%, rgba(240, 210, 160, 0.25) 0%, transparent 65%),
      linear-gradient(175deg, #E8D4B0 0%, #E5C498 25%, #DDB888 45%, #D8AA80 65%, #E0C0A0 85%, #E8D0B0 100%)
    `,
  },
  // 4. "Rose Garden" — dusty pink, salmon, cream, sage
  {
    name: 'rose',
    gradient: `
      radial-gradient(ellipse 55% 50% at 60% 40%, rgba(210, 150, 150, 0.5) 0%, transparent 55%),
      radial-gradient(ellipse 45% 45% at 30% 65%, rgba(190, 170, 150, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 50% 40% at 75% 70%, rgba(200, 160, 140, 0.35) 0%, transparent 45%),
      radial-gradient(ellipse 35% 30% at 20% 30%, rgba(170, 190, 160, 0.3) 0%, transparent 45%),
      radial-gradient(ellipse 40% 35% at 80% 25%, rgba(220, 180, 170, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse 90% 70% at 50% 50%, rgba(210, 190, 175, 0.2) 0%, transparent 70%),
      linear-gradient(165deg, #D4B8B0 0%, #D8BCA8 25%, #DCBCA0 45%, #D4B4A8 65%, #C8B8A8 85%, #D0C0B0 100%)
    `,
  },
  // 5. "Provence Lavender" — soft purple, warm gold, blue sky
  {
    name: 'provence',
    gradient: `
      radial-gradient(ellipse 60% 45% at 50% 30%, rgba(140, 160, 200, 0.35) 0%, transparent 50%),
      radial-gradient(ellipse 50% 50% at 35% 65%, rgba(170, 150, 190, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 45% 40% at 70% 60%, rgba(200, 180, 140, 0.35) 0%, transparent 45%),
      radial-gradient(ellipse 55% 35% at 50% 85%, rgba(180, 160, 130, 0.3) 0%, transparent 40%),
      radial-gradient(ellipse 30% 30% at 15% 40%, rgba(190, 170, 200, 0.3) 0%, transparent 45%),
      radial-gradient(ellipse 90% 80% at 50% 50%, rgba(190, 180, 185, 0.2) 0%, transparent 65%),
      linear-gradient(180deg, #B0B8D0 0%, #C0B8C8 25%, #D0C0B8 50%, #C8B8B0 75%, #D0C8C0 100%)
    `,
  },
]

export default function PaintingCarousel() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PAINTINGS.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {PAINTINGS.map((painting, i) => (
        <div
          key={painting.name}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: painting.gradient,
            opacity: i === activeIdx ? 1 : 0,
            transition: 'opacity 2s ease',
          }}
        />
      ))}
    </>
  )
}
