// Deck gradient shaders — adapted from HeroGradientGL.tsx
// Removed: uRevealProgress, uMouse/uMouseActive, shimmer mask
// Added: uColorA/uColorB (vec3), uBlockSize (float), uPixelated (float 0/1)

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = `
  precision highp float;

  uniform float uTime;         // frozen noise time (not wall-clock)
  uniform vec2 uResolution;    // container size in px
  uniform vec3 uColorA;        // bottom/primary color (RGB 0-1)
  uniform vec3 uColorB;        // top/secondary color (RGB 0-1)
  uniform float uBlockSize;    // pixel grid block size in px
  uniform float uPixelated;    // 0 = smooth, 1 = pixelated

  varying vec2 vUv;

  // ─── Cubic smoothstep for organic easing ───
  float ssmooth(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  // ─── Per-cell deterministic random ───
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // ─── Smooth 2D value noise for organic color movement ───
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

  // ─── Organic dual-color gradient ───
  vec3 computeGradient(vec2 uv, float time, vec3 peakA, vec3 peakB) {
    float gp = uv.y;

    // Color swirl: noise-driven blend between peakA and peakB
    float n1 = vnoise(uv * 1.8 + vec2(time * 0.10, time * 0.07));
    float n2 = vnoise(uv * 3.5 + vec2(-time * 0.08, time * 0.12));
    float n3 = vnoise(uv * 6.0 + vec2(time * 0.15, -time * 0.06));
    float swirl = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    float verticalBias = smoothstep(0.05, 0.95, gp);
    float colorMix = clamp(verticalBias + (swirl - 0.5) * 1.0, 0.0, 1.0);
    vec3 peak = mix(peakA, peakB, colorMix);

    // Subtle luminance wave
    float wave = (vnoise(uv * 2.0 + vec2(time * 0.06, -time * 0.04)) - 0.5) * 0.06;
    float protection = smoothstep(0.0, 0.25, gp);
    gp = clamp(gp + wave * protection, 0.0, 1.0);

    // Smooth luminance ramp: overlapping smoothsteps
    vec3 deep = peak * 0.06;
    vec3 mid  = peak * 0.35;
    vec3 wash = mix(peak, vec3(1.0), 0.5);

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

  vec3 getGradientColor(vec2 uv) {
    return computeGradient(uv, uTime, uColorA, uColorB);
  }

  void main() {
    vec3 smoothColor = getGradientColor(vUv);

    // Pixelated version: snap UV to grid cells
    vec2 grid = uResolution / uBlockSize;
    vec2 cellId = floor(vUv * grid);
    vec2 pixelUv = cellId / grid;
    // Per-column y-offset to break horizontal banding
    float colOffset = hash(vec2(cellId.x, 0.0)) * 0.035;
    pixelUv.y += colOffset;
    vec3 pixelColor = getGradientColor(pixelUv);

    // Blend based on uPixelated uniform
    vec3 finalColor = mix(smoothColor, pixelColor, uPixelated);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`
