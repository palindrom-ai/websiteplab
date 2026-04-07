'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Reveal from './Reveal'
import { STATS } from '../data/productContent'

/** Smooth count-up number — no jitter, clean easing */
function CountUp({ value, active }: { value: string; active: boolean }) {
  const match = value.match(/^([<>]?\s*)(\d+\.?\d*)(.*)$/)

  if (!match) {
    return (
      <span style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'inline-block',
      }}>
        {value}
      </span>
    )
  }

  const prefix = match[1]
  const target = parseFloat(match[2])
  const hasDecimal = match[2].includes('.')
  const suffix = match[3]

  return (
    <span>
      {prefix && <FadeIn active={active} delay={0}>{prefix}</FadeIn>}
      <AnimatedNumber target={target} hasDecimal={hasDecimal} active={active} />
      {suffix && <FadeIn active={active} delay={800}>{suffix}</FadeIn>}
    </span>
  )
}

function FadeIn({ children, active, delay }: { children: React.ReactNode; active: boolean; delay: number }) {
  return (
    <span style={{
      display: 'inline-block',
      opacity: active ? 1 : 0,
      transition: `opacity 0.4s ease ${delay}ms`,
    }}>
      {children}
    </span>
  )
}

function AnimatedNumber({ target, hasDecimal, active }: { target: number; hasDecimal: boolean; active: boolean }) {
  const [current, setCurrent] = useState(0)
  const rafRef = useRef(0)

  const animate = useCallback(() => {
    const duration = 1600
    let start = 0

    const tick = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      // Expo ease-out — smooth deceleration, no jitter
      const eased = 1 - Math.pow(1 - progress, 5)
      setCurrent(eased * target)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCurrent(target)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [target])

  useEffect(() => {
    if (active) animate()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, animate])

  const display = hasDecimal ? current.toFixed(1) : Math.round(current).toString()

  return (
    <span style={{
      display: 'inline-block',
      opacity: active ? 1 : 0,
      transform: active ? 'translateY(0)' : 'translateY(24px)',
      transition: 'opacity 0.3s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      {active ? display : '0'}
    </span>
  )
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="plat-stats">
      <Reveal>
        <div className="plat-stats-header">
          <h2 className="plat-h2 plat-h2--large">Engineered for decisions. Built for speed.</h2>
        </div>
      </Reveal>
      <div className="plat-stats-row">
        {STATS.map((s, i) => (
          <div key={s.label} className="plat-stat">
            <div className="plat-stat-value">
              <CountUp value={s.value} active={visible} />
            </div>
            <div className="plat-stat-label" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.6s ease ${1.0 + i * 0.15}s`,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
