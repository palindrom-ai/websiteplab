'use client'

import { COLOR_PRESETS, ASPECT_RATIOS, RESOLUTION_PRESETS, rgbToHex, hexToRgb } from '../utils/presets'
import type { DeckParams } from '../page'

interface ControlPanelProps {
  params: DeckParams
  onChange: (partial: Partial<DeckParams>) => void
  onExport: () => void
  onRandomize: () => void
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = '',
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div className="deck-slider-group">
      <div className="deck-slider-label">
        <span>{label}</span>
        <span>{step < 1 ? value.toFixed(1) : value}{suffix}</span>
      </div>
      <input
        type="range"
        className="deck-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="deck-toggle-row">
      <span>{label}</span>
      <label className="deck-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <div className="deck-toggle-track" />
        <div className="deck-toggle-thumb" />
      </label>
    </div>
  )
}

export default function ControlPanel({ params, onChange, onExport, onRandomize }: ControlPanelProps) {
  return (
    <aside className="deck-sidebar">
      {/* ── Palette ── */}
      <div className="deck-section">
        <div className="deck-section-title">Palette</div>
        <div className="deck-palette-grid">
          {COLOR_PRESETS.map(preset => {
            const isActive = preset.id === params.presetId
            const gradientCSS = `linear-gradient(135deg, rgb(${preset.colorA.join(',')}), rgb(${preset.colorB.join(',')}))`
            return (
              <button
                key={preset.id}
                className={`deck-palette-swatch ${isActive ? 'active' : ''}`}
                onClick={() => onChange({
                  presetId: preset.id,
                  colorA: preset.colorA,
                  colorB: preset.colorB,
                })}
                title={preset.label}
              >
                <div className="deck-palette-preview" style={{ background: gradientCSS }} />
                <span className="deck-palette-label">{preset.label}</span>
              </button>
            )
          })}
        </div>

        {/* Fine-tune color pickers */}
        <div className="deck-fine-tune">
          <div className="deck-color-row">
            <span>Color A</span>
            <input
              type="color"
              className="deck-color-picker"
              value={rgbToHex(...params.colorA)}
              onChange={e => onChange({ colorA: hexToRgb(e.target.value), presetId: null })}
            />
            <span className="deck-color-hex">{rgbToHex(...params.colorA)}</span>
          </div>
          <div className="deck-color-row">
            <span>Color B</span>
            <input
              type="color"
              className="deck-color-picker"
              value={rgbToHex(...params.colorB)}
              onChange={e => onChange({ colorB: hexToRgb(e.target.value), presetId: null })}
            />
            <span className="deck-color-hex">{rgbToHex(...params.colorB)}</span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="deck-section">
        <div className="deck-section-title">Grid</div>
        <Slider
          label="Block Size"
          value={params.blockSize}
          min={10}
          max={80}
          onChange={v => onChange({ blockSize: v })}
          suffix="px"
        />
        <Toggle
          label="Pixel Mode"
          checked={params.pixelated}
          onChange={v => onChange({ pixelated: v })}
        />
      </div>

      {/* ── Noise ── */}
      <div className="deck-section">
        <div className="deck-section-title">Noise Pattern</div>
        <Slider
          label="Seed"
          value={params.noiseTime}
          min={0}
          max={45}
          step={0.1}
          onChange={v => onChange({ noiseTime: v })}
        />
        <button className="deck-action-btn" onClick={onRandomize}>
          Randomize
        </button>
      </div>

      {/* ── ASCII Overlay ── */}
      <div className="deck-section">
        <div className="deck-section-title">ASCII Overlay</div>
        <Toggle
          label="Enable ASCII"
          checked={params.asciiEnabled}
          onChange={v => onChange({ asciiEnabled: v })}
        />
        {params.asciiEnabled && (
          <>
            <Slider
              label="Density"
              value={params.asciiDensity}
              min={0.1}
              max={0.8}
              step={0.05}
              onChange={v => onChange({ asciiDensity: v })}
            />
            <Slider
              label="Opacity"
              value={Math.round(params.asciiOpacity * 100)}
              min={0}
              max={100}
              onChange={v => onChange({ asciiOpacity: v / 100 })}
              suffix="%"
            />
          </>
        )}
      </div>

      {/* ── Grain ── */}
      <div className="deck-section">
        <div className="deck-section-title">Film Grain</div>
        <Toggle
          label="Enable Grain"
          checked={params.grainEnabled}
          onChange={v => onChange({ grainEnabled: v })}
        />
        {params.grainEnabled && (
          <Slider
            label="Intensity"
            value={Math.round(params.grainOpacity * 100)}
            min={1}
            max={30}
            onChange={v => onChange({ grainOpacity: v / 100 })}
            suffix="%"
          />
        )}
      </div>

      {/* ── Text ── */}
      <div className="deck-section">
        <div className="deck-section-title">Text Overlay</div>
        <input
          className="deck-text-input"
          type="text"
          value={params.textContent}
          onChange={e => onChange({ textContent: e.target.value })}
          placeholder="Enter text..."
        />
        <Slider
          label="Font Size"
          value={params.textSize}
          min={24}
          max={120}
          onChange={v => onChange({ textSize: v })}
          suffix="px"
        />

        {/* Position presets */}
        <div className="deck-slider-label" style={{ marginBottom: 8 }}>
          <span>Position</span>
        </div>
        <div className="deck-position-grid">
          {([
            { id: 'top-left' as const, label: 'Top Left' },
            { id: 'center' as const, label: 'Center' },
            { id: 'bottom-left' as const, label: 'Bottom Left' },
            { id: 'bottom-right' as const, label: 'Bottom Right' },
          ]).map(pos => (
            <button
              key={pos.id}
              className={`deck-position-btn ${params.textPosition === pos.id ? 'active' : ''}`}
              onClick={() => onChange({ textPosition: pos.id })}
            >
              {pos.label}
            </button>
          ))}
        </div>

        {/* Text color */}
        <div className="deck-color-row">
          <span>Color</span>
          <input
            type="color"
            className="deck-color-picker"
            value={params.textColor}
            onChange={e => onChange({ textColor: e.target.value })}
          />
          <span className="deck-color-hex">{params.textColor}</span>
        </div>

        {/* Font toggle */}
        <div style={{ marginTop: 12 }}>
          <div className="deck-toggle-group">
            <button
              className={`deck-toggle-btn ${params.textFont === 'inter' ? 'active' : ''}`}
              onClick={() => onChange({ textFont: 'inter' })}
            >
              Inter
            </button>
            <button
              className={`deck-toggle-btn ${params.textFont === 'mono' ? 'active' : ''}`}
              onClick={() => onChange({ textFont: 'mono' })}
            >
              Mono
            </button>
          </div>
        </div>
      </div>

      {/* ── Export ── */}
      <div className="deck-section">
        <div className="deck-section-title">Export</div>

        {/* Aspect ratio */}
        <div className="deck-slider-label" style={{ marginBottom: 8 }}>
          <span>Aspect Ratio</span>
        </div>
        <div className="deck-toggle-group" style={{ marginBottom: 14 }}>
          {ASPECT_RATIOS.map(ar => (
            <button
              key={ar.id}
              className={`deck-toggle-btn ${params.aspectRatio === ar.id ? 'active' : ''}`}
              onClick={() => onChange({ aspectRatio: ar.id })}
            >
              {ar.label}
            </button>
          ))}
        </div>

        {/* Resolution */}
        <div className="deck-slider-label" style={{ marginBottom: 8 }}>
          <span>Resolution</span>
        </div>
        <div className="deck-toggle-group" style={{ marginBottom: 14 }}>
          {RESOLUTION_PRESETS.map(res => (
            <button
              key={res.id}
              className={`deck-toggle-btn ${params.exportResolution === res.id ? 'active' : ''}`}
              onClick={() => onChange({ exportResolution: res.id })}
            >
              {res.label}
            </button>
          ))}
        </div>

        <button className="deck-export-btn" onClick={onExport}>
          Export PNG
        </button>
      </div>
    </aside>
  )
}
