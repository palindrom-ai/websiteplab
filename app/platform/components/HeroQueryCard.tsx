'use client'

import { useEffect, useState, useRef } from 'react'

/* ─────────────────────────────────────────────
   Floating card on hero — simulates a user
   querying the Cortex context graph.
   Like Onresonant's dictation card overlay.
   ───────────────────────────────────────────── */

const QUERIES = [
  'What discount precedent exists for this account?',
  'Show me all escalation decisions from Q1',
  'Why was this renewal approved at 30% off?',
  'Which agent handled the ServiceNow migration?',
]

export default function HeroQueryCard() {
  const [queryIdx, setQueryIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pause' | 'clearing'>('typing')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const currentQuery = QUERIES[queryIdx]

  useEffect(() => {
    if (phase === 'typing') {
      if (charIdx < currentQuery.length) {
        timerRef.current = setTimeout(() => {
          setCharIdx((c) => c + 1)
        }, 35 + Math.random() * 25)
      } else {
        timerRef.current = setTimeout(() => setPhase('pause'), 2000)
      }
    } else if (phase === 'pause') {
      timerRef.current = setTimeout(() => setPhase('clearing'), 500)
    } else if (phase === 'clearing') {
      timerRef.current = setTimeout(() => {
        setCharIdx(0)
        setQueryIdx((q) => (q + 1) % QUERIES.length)
        setPhase('typing')
      }, 300)
    }

    return () => clearTimeout(timerRef.current)
  }, [phase, charIdx, currentQuery.length, queryIdx])

  const displayText = phase === 'clearing' ? '' : currentQuery.slice(0, charIdx)

  return (
    <div className="plat-hero-query-card">
      <div className="plat-hero-query-label">
        <span className="plat-hero-query-dot" />
        Querying Cortex
      </div>
      <div className="plat-hero-query-text">
        {displayText}
        <span className="plat-hero-query-cursor" />
      </div>
    </div>
  )
}
