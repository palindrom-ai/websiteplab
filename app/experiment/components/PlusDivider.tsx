'use client'

import { useEffect, useRef } from 'react'

/**
 * PlusDivider — Isidor-style section divider with centered + symbol
 *
 * Horizontal 1px line with a centered + mark.
 * Purely decorative, replacing generic <hr> elements.
 */

export default function PlusDivider() {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: { revert: () => void } | null = null
    const initGsap = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      const el = divRef.current
      if (!el) return
      ctx = gsap.context(() => {
        gsap.fromTo(el, { opacity: 0, scaleX: 0 }, {
          opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        })
      })
    }
    initGsap()
    return () => { ctx?.revert() }
  }, [])

  return (
    <div ref={divRef} className="exp-plus-divider" aria-hidden="true" style={{ opacity: 0 }}>
      <span className="exp-plus-divider-mark">+</span>
    </div>
  )
}
