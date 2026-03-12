'use client'

import { useState, useRef, useCallback } from 'react'
import './deck.css'
import DeckCanvas, { DeckCanvasHandle } from './components/DeckCanvas'
import ControlPanel from './components/ControlPanel'
import { exportDeckPNG } from './utils/deckExport'
import { COLOR_PRESETS } from './utils/presets'

export interface DeckParams {
  colorA: [number, number, number]   // RGB 0-255
  colorB: [number, number, number]   // RGB 0-255
  presetId: string | null
  blockSize: number                  // 10-80, default 45
  pixelated: boolean                 // default true
  noiseTime: number                  // 0-45, controls noise pattern
  asciiEnabled: boolean              // default true
  asciiDensity: number               // 0.1-0.8, default 0.4
  asciiOpacity: number               // 0-1, default 0.5
  grainEnabled: boolean              // default true
  grainOpacity: number               // 0-1, default 0.03
  textContent: string
  textSize: number                   // 24-120px
  textPosition: 'center' | 'bottom-left' | 'bottom-right' | 'top-left'
  textColor: string                  // hex
  textFont: 'inter' | 'mono'
  aspectRatio: '16:9' | '4:3' | '1:1'
  exportResolution: '1080p' | '1440p' | '4k'
}

const DEFAULT_PARAMS: DeckParams = {
  colorA: COLOR_PRESETS[0].colorA,
  colorB: COLOR_PRESETS[0].colorB,
  presetId: COLOR_PRESETS[0].id,
  blockSize: 45,
  pixelated: true,
  noiseTime: 5.0,
  asciiEnabled: true,
  asciiDensity: 0.4,
  asciiOpacity: 0.5,
  grainEnabled: true,
  grainOpacity: 0.06,
  textContent: '',
  textSize: 64,
  textPosition: 'center',
  textColor: '#ffffff',
  textFont: 'inter',
  aspectRatio: '16:9',
  exportResolution: '1080p',
}

export default function DeckToolPage() {
  const [params, setParams] = useState<DeckParams>(DEFAULT_PARAMS)
  const canvasRef = useRef<DeckCanvasHandle>(null)

  const handleChange = useCallback((partial: Partial<DeckParams>) => {
    setParams(prev => ({ ...prev, ...partial }))
  }, [])

  const handleRandomize = useCallback(() => {
    setParams(prev => ({ ...prev, noiseTime: Math.round(Math.random() * 450) / 10 }))
  }, [])

  const handleExport = useCallback(() => {
    if (!canvasRef.current) return
    exportDeckPNG(canvasRef.current.renderToCanvas, params)
  }, [params])

  return (
    <div className="deck-tool">
      <main className="deck-canvas-area">
        <DeckCanvas ref={canvasRef} params={params} />
      </main>

      <ControlPanel
        params={params}
        onChange={handleChange}
        onExport={handleExport}
        onRandomize={handleRandomize}
      />
    </div>
  )
}
