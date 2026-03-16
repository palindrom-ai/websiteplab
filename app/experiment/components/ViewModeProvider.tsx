'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import posthog from 'posthog-js'

type ViewMode = 'human' | 'machine'

interface ViewModeContextValue {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  isMachine: boolean
}

const ViewModeContext = createContext<ViewModeContextValue>({
  viewMode: 'human',
  setViewMode: () => {},
  isMachine: false,
})

export function useViewMode() {
  return useContext(ViewModeContext)
}

export default function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('human')

  // Read ?mode=machine from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'machine') {
      setViewModeState('machine')
    }
  }, [])

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)

    // Update URL without reload
    const url = new URL(window.location.href)
    if (mode === 'machine') {
      url.searchParams.set('mode', 'machine')
    } else {
      url.searchParams.delete('mode')
    }
    history.replaceState(null, '', url.toString())

    posthog.capture('human_machine_toggled', { mode })
  }, [])

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, isMachine: viewMode === 'machine' }}>
      {children}
    </ViewModeContext.Provider>
  )
}
