// Brand color pair presets + aspect ratio / resolution constants

export interface ColorPreset {
  id: string
  label: string
  colorA: [number, number, number] // RGB 0-255
  colorB: [number, number, number]
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'orchid-salmon',    label: 'Orchid + Salmon',    colorA: [186, 85, 211], colorB: [255, 160, 122] },
  { id: 'blue-turquoise',   label: 'Blue + Turquoise',   colorA: [0, 0, 255],    colorB: [64, 224, 208] },
  { id: 'green-orchid',     label: 'Green + Orchid',     colorA: [185, 233, 121], colorB: [186, 85, 211] },
  { id: 'salmon-blue',      label: 'Salmon + Blue',      colorA: [255, 160, 122], colorB: [0, 0, 255] },
  { id: 'turquoise-green',  label: 'Turquoise + Green',  colorA: [64, 224, 208],  colorB: [185, 233, 121] },
  { id: 'orchid-turquoise', label: 'Orchid + Turquoise', colorA: [186, 85, 211],  colorB: [64, 224, 208] },
  { id: 'blue-salmon',      label: 'Blue + Salmon',      colorA: [0, 0, 255],     colorB: [255, 160, 122] },
  { id: 'deep-purple',      label: 'Deep Purple',        colorA: [106, 27, 154],  colorB: [186, 85, 211] },
]

export interface AspectRatio {
  id: '16:9' | '4:3' | '1:1'
  label: string
  ratio: number // width / height
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { id: '16:9', label: '16:9', ratio: 16 / 9 },
  { id: '4:3',  label: '4:3',  ratio: 4 / 3 },
  { id: '1:1',  label: '1:1',  ratio: 1 },
]

export interface ResolutionPreset {
  id: '1080p' | '1440p' | '4k'
  label: string
  width: number
  height: number
}

// Resolution presets are based on 16:9 — export scales to actual aspect ratio
export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  { id: '1080p', label: '1080p', width: 1920, height: 1080 },
  { id: '1440p', label: '1440p', width: 2560, height: 1440 },
  { id: '4k',    label: '4K',    width: 3840, height: 2160 },
]

/** Given an aspect ratio and resolution preset, compute export dimensions */
export function getExportDimensions(
  aspectRatio: '16:9' | '4:3' | '1:1',
  resolution: '1080p' | '1440p' | '4k'
): { width: number; height: number } {
  const res = RESOLUTION_PRESETS.find(r => r.id === resolution)!
  const ar = ASPECT_RATIOS.find(a => a.id === aspectRatio)!

  // Use the resolution height as the base, compute width from aspect ratio
  const height = res.height
  const width = Math.round(height * ar.ratio)

  // Ensure even dimensions
  return {
    width: width % 2 === 0 ? width : width + 1,
    height: height % 2 === 0 ? height : height + 1,
  }
}

/** Convert RGB 0-255 to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

/** Convert hex string to RGB 0-255 tuple */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}
