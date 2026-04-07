'use client'

import { LOGO_STRIP } from '../data/productContent'

export default function LogoStrip() {
  return (
    <div className="plat-logos">
      <p className="plat-logos-label">{LOGO_STRIP.label}</p>
      <div className="plat-logos-row">
        {LOGO_STRIP.logos.map((logo) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={logo.alt} src={logo.src} alt={logo.alt} />
        ))}
      </div>
    </div>
  )
}
