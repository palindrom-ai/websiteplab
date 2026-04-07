'use client'

import Reveal from './Reveal'
import { PRODUCT_CTA, DEMO_HREF } from '../data/productContent'

export default function PlatformCTA() {
  return (
    <>
      <section className="plat-cta-section" id="contact">
        <Reveal>
          <div className="plat-cta-inner">
            <h2 className="plat-cta-heading">{PRODUCT_CTA.heading}</h2>
            <p className="plat-cta-sub">{PRODUCT_CTA.subheading}</p>
            <a href={DEMO_HREF} className="plat-btn-inverted">
              {PRODUCT_CTA.cta}
              <svg className="plat-arrow-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 6h10M7 2l4 4-4 4" />
              </svg>
            </a>
          </div>
        </Reveal>
      </section>

      <footer className="plat-footer">
        <div className="plat-footer-inner">
          <div className="plat-footer-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="Progression Labs" />
            <span>Progression Labs</span>
          </div>
          <div className="plat-footer-copy">
            &copy; 2026 Progression Labs. All rights reserved.
          </div>
          <div className="plat-footer-social">
            <a href="https://linkedin.com/company/progressionlabs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
