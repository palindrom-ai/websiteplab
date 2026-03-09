'use client'

import { useRef, useEffect } from 'react'
import { SHARED_START } from './sharedTime'

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShaderSource = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float ssmooth(float t) { return t * t * (3.0 - 2.0 * t); }

  // Brand palette — same 5 colors as hero
  vec3 brandColor(int i) {
    if (i == 0) return vec3(0.729, 0.333, 0.827); // Orchid
    if (i == 1) return vec3(1.000, 0.627, 0.478); // Salmon
    if (i == 2) return vec3(0.725, 0.914, 0.475); // Green
    if (i == 3) return vec3(0.251, 0.878, 0.816); // Turquoise
    return vec3(0.000, 0.000, 1.000);              // Blue
  }

  // 9-state color cycle over 45s — same as hero
  void cycleColors(float time, out vec3 peakA, out vec3 peakB) {
    vec3 cO = brandColor(0); vec3 cS = brandColor(1);
    vec3 cG = brandColor(2); vec3 cT = brandColor(3); vec3 cB = brandColor(4);

    float progress = mod(time, 45.0) / 45.0;
    float seg = progress * 9.0;
    int idx = int(floor(seg));
    float t = ssmooth(seg - floor(seg));

    vec3 fA, fB, tA, tB;
    if (idx == 0)      { fA = cO; fB = cO; tA = cB; tB = cS; }
    else if (idx == 1) { fA = cB; fB = cS; tA = cG; tB = cG; }
    else if (idx == 2) { fA = cG; fB = cG; tA = cO; tB = cT; }
    else if (idx == 3) { fA = cO; fB = cT; tA = cS; tB = cS; }
    else if (idx == 4) { fA = cS; fB = cS; tA = cB; tB = cT; }
    else if (idx == 5) { fA = cB; fB = cT; tA = cB; tB = cB; }
    else if (idx == 6) { fA = cB; fB = cB; tA = cO; tB = cG; }
    else if (idx == 7) { fA = cO; fB = cG; tA = cT; tB = cT; }
    else               { fA = cT; fB = cT; tA = cO; tB = cO; }

    peakA = mix(fA, tA, t);
    peakB = mix(fB, tB, t);
  }

  vec3 computeGradient(vec2 uv, float time, vec3 peakA, vec3 peakB) {
    float gp = uv.y;

    float n1 = vnoise(uv * 1.8 + vec2(time * 0.10, time * 0.07));
    float n2 = vnoise(uv * 3.5 + vec2(-time * 0.08, time * 0.12));
    float n3 = vnoise(uv * 6.0 + vec2(time * 0.15, -time * 0.06));
    float swirl = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    float verticalBias = smoothstep(0.05, 0.95, gp);
    float colorMix = clamp(verticalBias + (swirl - 0.5) * 1.0, 0.0, 1.0);
    vec3 peak = mix(peakA, peakB, colorMix);

    // Luminance ramp — full range, bright and vivid
    vec3 deep = peak * 0.15;
    vec3 mid  = peak * 0.5;
    vec3 wash = mix(peak, vec3(1.0), 0.4);

    float t1 = smoothstep(0.00, 0.10, gp);
    float t2 = smoothstep(0.06, 0.24, gp);
    float t3 = smoothstep(0.15, 0.55, gp);
    float t4 = smoothstep(0.45, 0.85, gp);
    float t5 = smoothstep(0.75, 1.00, gp);

    vec3 color = mix(vec3(0.004), deep, t1);
    color = mix(color, mid, t2);
    color = mix(color, peak, t3);
    color = mix(color, wash, t4);
    color = mix(color, vec3(1.0), t5);
    return color;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Mosaic grid — 45px blocks
    float blockPx = 45.0;
    vec2 grid = u_resolution / blockPx;
    vec2 cellId = floor(uv * grid);
    vec2 pixelUv = (cellId + 0.5) / grid;

    float colOffset = hash(vec2(cellId.x, 0.0)) * 0.035;
    pixelUv.y += colOffset;

    vec3 peakA, peakB;
    cycleColors(u_time, peakA, peakB);

    vec3 smoothColor = computeGradient(uv, u_time, peakA, peakB);
    vec3 pixelColor = computeGradient(pixelUv, u_time, peakA, peakB);
    pixelColor += (hash(cellId) - 0.5) * 0.035;

    // Diagonal shimmer
    float diag = (uv.x + 1.0 - uv.y) * 0.5;
    float shimmerPos = fract(u_time * 0.25);
    float shimmerDist = abs(diag - shimmerPos);
    shimmerDist = min(shimmerDist, 1.0 - shimmerDist);
    float shimmerMask = exp(-shimmerDist * shimmerDist * 120.0) * 0.6;

    vec3 color = mix(smoothColor, pixelColor, shimmerMask);

    // Grain
    float grain = (hash(gl_FragCoord.xy + u_time * 0.3) - 0.5) * 0.04;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function FooterGradientText() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
    if (!gl) return

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
    const program = gl.createProgram()
    if (!program || !vertexShader || !fragmentShader) return

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
    }
    window.addEventListener('resize', resize)
    resize()

    let animationFrameId: number
    const render = () => {
      gl.uniform1f(timeLoc, performance.now() / 1000.0 - SHARED_START)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="exp-footer-gradient-text">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      <h2 className="exp-footer-gradient-heading">
        Progression Labs
      </h2>
    </div>
  )
}
