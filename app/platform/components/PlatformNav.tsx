'use client'

import { PRODUCT_NAV_LINKS, DEMO_HREF } from '../data/productContent'

export default function PlatformNav() {
  return (
    <div className="plat-nav-wrap">
      <nav className="plat-nav">
        <div className="plat-nav-logo-group">
          <div className="plat-nav-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-black.png"
              alt="Progression Labs"
              style={{ height: 22, width: 'auto' }}
            />
          </div>
          <span className="plat-nav-brand">Progression Labs</span>
        </div>

        <ul className="plat-nav-links">
          {PRODUCT_NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <div className="plat-nav-right">
          <a href={DEMO_HREF} className="plat-btn-primary">
            Request a Demo
            <svg className="plat-arrow-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </a>
        </div>
      </nav>
    </div>
  )
}
