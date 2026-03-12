'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '../shaders/deckGradient'

export interface DeckRendererParams {
  colorA: [number, number, number]
  colorB: [number, number, number]
  blockSize: number
  pixelated: boolean
  noiseTime: number
}

export interface DeckRendererHandle {
  /** Render a single frame to an external canvas at given dimensions (for export) */
  renderToCanvas: (target: HTMLCanvasElement, width: number, height: number) => void
}

/**
 * Hook that manages the Three.js WebGL renderer for the deck gradient.
 *
 * Key design choices:
 * - preserveDrawingBuffer: true — required for toDataURL() export
 * - uTime is driven by params.noiseTime (user-controlled), not wall-clock time
 * - ResizeObserver keeps the canvas responsive to container size changes
 */
export function useDeckRenderer(
  containerRef: React.RefObject<HTMLDivElement | null>,
  params: DeckRendererParams,
): DeckRendererHandle {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rafRef = useRef<number>(0)
  const mountedRef = useRef(true)
  const paramsRef = useRef(params)
  paramsRef.current = params

  useEffect(() => {
    mountedRef.current = true
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 300

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10)
    camera.position.z = 1
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: true, // Required for PNG export
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: paramsRef.current.noiseTime },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColorA: { value: new THREE.Vector3(
          paramsRef.current.colorA[0] / 255,
          paramsRef.current.colorA[1] / 255,
          paramsRef.current.colorA[2] / 255,
        )},
        uColorB: { value: new THREE.Vector3(
          paramsRef.current.colorB[0] / 255,
          paramsRef.current.colorB[1] / 255,
          paramsRef.current.colorB[2] / 255,
        )},
        uBlockSize: { value: paramsRef.current.blockSize },
        uPixelated: { value: paramsRef.current.pixelated ? 1.0 : 0.0 },
      },
    })
    materialRef.current = material

    const geometry = new THREE.PlaneGeometry(1, 1)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const tick = () => {
      if (!mountedRef.current) return
      const p = paramsRef.current

      material.uniforms.uTime.value = p.noiseTime
      material.uniforms.uColorA.value.set(p.colorA[0] / 255, p.colorA[1] / 255, p.colorA[2] / 255)
      material.uniforms.uColorB.value.set(p.colorB[0] / 255, p.colorB[1] / 255, p.colorB[2] / 255)
      material.uniforms.uBlockSize.value = p.blockSize
      material.uniforms.uPixelated.value = p.pixelated ? 1.0 : 0.0

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // ResizeObserver for responsive canvas
    const ro = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect
      if (w > 0 && h > 0 && rendererRef.current) {
        rendererRef.current.setSize(w, h)
        if (materialRef.current) {
          materialRef.current.uniforms.uResolution.value.set(w, h)
        }
      }
    })
    ro.observe(container)

    return () => {
      mountedRef.current = false
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          if (obj.material instanceof THREE.ShaderMaterial) {
            obj.material.dispose()
          }
        }
      })
    }
  }, [containerRef])

  /**
   * Render a single frame to a target canvas at export resolution.
   * Creates a temporary renderer at the target size, renders, then copies pixels.
   */
  const renderToCanvas = useCallback((target: HTMLCanvasElement, width: number, height: number) => {
    const scene = sceneRef.current
    const camera = cameraRef.current
    const material = materialRef.current
    if (!scene || !camera || !material) return

    // Create a temporary renderer at the export resolution
    const exportRenderer = new THREE.WebGLRenderer({
      canvas: target,
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    })
    exportRenderer.setSize(width, height)
    exportRenderer.setPixelRatio(1) // Export at exact pixel dimensions

    // Update resolution uniform to match export size
    const prevRes = material.uniforms.uResolution.value.clone()
    material.uniforms.uResolution.value.set(width, height)

    exportRenderer.render(scene, camera)

    // Restore previous resolution
    material.uniforms.uResolution.value.copy(prevRes)

    exportRenderer.dispose()
  }, [])

  return { renderToCanvas }
}
