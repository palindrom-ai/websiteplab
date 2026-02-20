'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Uppercase + digits + symbols — fast cipher aesthetic
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-=<>[]{}|/'

interface TextScrambleProps {
  text: string
  trigger: 'load' | 'inView'
  delay?: number
  duration?: number
  className?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  triggerWhen?: boolean // external gate — animation won't start until this is true
}

function randomChar(): string {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)]
}

function buildText(text: string, resolvedCount: number): string {
  let resolved = 0
  let result = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      result += ' '
    } else if (resolved < resolvedCount) {
      result += text[i]
      resolved++
    } else {
      result += randomChar()
    }
  }
  return result
}

export default function TextScramble({
  text,
  trigger,
  delay = 0,
  duration = 800,
  className,
  tag = 'h2',
  triggerWhen,
}: TextScrambleProps) {
  const containerRef = useRef<HTMLElement>(null)
  // Start with original text to avoid hydration mismatch (SSR renders same as client)
  const [displayText, setDisplayText] = useState(text)
  const [mounted, setMounted] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [done, setDone] = useState(false)
  const hasTriggeredRef = useRef(false)
  const resolvedCountRef = useRef(0)

  const totalNonSpace = useRef(text.split('').filter(ch => ch !== ' ').length)

  // After mount, scramble the text so it appears encrypted before animation starts
  useEffect(() => {
    setMounted(true)
    setDisplayText(buildText(text, 0))
  }, [text])

  const startAnimation = useCallback(() => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true
    resolvedCountRef.current = 0
    setAnimating(true)
  }, [])

  // Handle trigger="load"
  useEffect(() => {
    if (!mounted) return
    if (trigger !== 'load') return
    if (triggerWhen !== undefined && !triggerWhen) return
    const timer = setTimeout(startAnimation, delay)
    return () => clearTimeout(timer)
  }, [mounted, trigger, delay, triggerWhen, startAnimation])

  // Handle trigger="inView"
  useEffect(() => {
    if (!mounted) return
    if (trigger !== 'inView') return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(startAnimation, delay)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, trigger, delay, startAnimation])

  // Main animation loop — rAF drives both resolution progress and random cycling
  useEffect(() => {
    if (!animating || done) return

    const total = totalNonSpace.current
    let startTime = 0
    let frameId: number

    const loop = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out: fast start, smooth finish
      const eased = 1 - Math.pow(1 - progress, 2.5)
      const resolvedCount = Math.floor(eased * total)
      resolvedCountRef.current = resolvedCount

      // Build text with resolved + scrambled chars (random changes each frame)
      setDisplayText(buildText(text, resolvedCount))

      if (progress >= 1) {
        setDisplayText(text)
        setDone(true)
        setAnimating(false)
        return
      }

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [animating, done, text, duration])

  const Tag = tag

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={className || ''}
      suppressHydrationWarning
    >
      {displayText}
    </Tag>
  )
}
