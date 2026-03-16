'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { TESTIMONIALS } from '../data/siteContent'

const testimonials = TESTIMONIALS

export default function ProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-rotate testimonials every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  // GSAP ScrollTrigger fade-up entrance
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    let ctx: { revert: () => void } | null = null

    const initGsap = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.set(el, { opacity: 0 })
        gsap.to(el, {
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            once: true,
          },
        })
      }, el)
    }

    initGsap()

    return () => {
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="exp-section">
      {/* Testimonials — CSS Grid stack so height matches tallest quote (zero layout shift) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'grid' }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                gridArea: '1 / 1',
                opacity: i === activeIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
                pointerEvents: i === activeIndex ? 'auto' : 'none',
              }}
            >
              <blockquote className="exp-quote" style={{ margin: '0 auto' }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="exp-quote-author">
                <strong>{t.author}</strong> &mdash; {t.role}
              </div>

            </div>
          ))}
        </div>

        {/* Dots indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`Show testimonial ${i + 1}`}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: i === activeIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                transition: 'background 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
