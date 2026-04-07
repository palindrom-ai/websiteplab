'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────
   GSAP ScrollTrigger reveal wrapper.
   Fades up children when they enter the viewport.
   ───────────────────────────────────────────── */

interface RevealProps {
  children: React.ReactNode
  /** Delay before animation starts (seconds) */
  delay?: number
  /** If true, staggers direct children */
  stagger?: number
  /** Y translate distance (px) */
  y?: number
  /** Duration in seconds */
  duration?: number
  className?: string
  style?: React.CSSProperties
}

export default function Reveal({
  children,
  delay = 0,
  stagger,
  y = 24,
  duration = 0.7,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ctx: { revert: () => void } | null = null

    const init = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (stagger) {
          // Stagger direct children
          const children = el.children
          gsap.set(children, { opacity: 0, y })
          gsap.to(children, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true,
            },
          })
        } else {
          // Animate the container itself
          gsap.set(el, { opacity: 0, y })
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              once: true,
            },
          })
        }
      }, el)
    }

    init()
    return () => { ctx?.revert() }
  }, [delay, stagger, y, duration])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
