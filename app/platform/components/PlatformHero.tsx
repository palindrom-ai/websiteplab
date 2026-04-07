'use client'

import ConvergenceCanvas from './ConvergenceCanvas'
import HeroQueryCard from './HeroQueryCard'
import PaintingCarousel from './PaintingCarousel'
import { PRODUCT_HERO, DEMO_HREF } from '../data/productContent'

export default function PlatformHero() {
  return (
    <section className="plat-hero" id="platform">
      <div className="plat-hero-text">
        <p className="plat-label">Progression Labs introduces</p>
        <h1 className="plat-h1">
          Cortex
        </h1>
        <p className="plat-hero-tagline">
          The <em>context layer</em> your AI agents actually need
        </p>
        <p className="plat-body">{PRODUCT_HERO.subheadline}</p>
        <div className="plat-hero-buttons">
          <a href={DEMO_HREF} className="plat-btn-primary">
            {PRODUCT_HERO.primaryCta}
            <svg className="plat-arrow-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </a>
          <a href="#features" className="plat-btn-ghost">
            Learn more
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 1v10M2 7l4 4 4-4" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hero visual — painting bg + convergence animation + grid + query card */}
      <div className="plat-hero-visual">
        <PaintingCarousel />
        <ConvergenceCanvas />
        <div className="plat-hero-grid-overlay" />
        <div className="plat-hero-amber-wash" />
        <HeroQueryCard />
      </div>
    </section>
  )
}
