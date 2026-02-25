'use client'

const PIXEL_COUNT = 12
const PIXEL_WIDTH = 3 // px
const PIXEL_GAP = 2   // px gap between pixels

export default function NavPixelWhip() {
  return (
    <span className="nav-pixel-whip" aria-hidden="true">
      {Array.from({ length: PIXEL_COUNT }, (_, i) => (
        <span
          key={i}
          className="nav-pixel"
          style={{
            left: `${i * (PIXEL_WIDTH + PIXEL_GAP)}px`,
            transitionDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </span>
  )
}
