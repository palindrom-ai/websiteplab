'use client'

import { useEffect, useRef, useState } from 'react'
import { useViewMode } from './ViewModeProvider'

/**
 * Brief black flash overlay — mimics a monitor flicking off/on between views.
 * Not an animation. A single-beat hard flash (~120ms of black) that makes the
 * instant content swap feel like a deliberate "reboot" rather than a glitch.
 */
export default function ViewTransition() {
  const { viewMode } = useViewMode()
  const prevMode = useRef(viewMode)
  const [flashing, setFlashing] = useState(false)

  useEffect(() => {
    if (prevMode.current === viewMode) return
    prevMode.current = viewMode

    // Flash on
    setFlashing(true)

    // Flash off after a beat — just long enough to register as intentional
    const timer = setTimeout(() => setFlashing(false), 120)
    return () => clearTimeout(timer)
  }, [viewMode])

  if (!flashing) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99,
        backgroundColor: '#010101',
        pointerEvents: 'none',
      }}
    />
  )
}
