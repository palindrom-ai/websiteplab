'use client'

import Reveal from './Reveal'
import { PRICING_TIERS, DEMO_HREF } from '../data/productContent'

export default function PricingSection() {
  return (
    <section className="plat-pricing" id="pricing">
      <Reveal>
        <div className="plat-pricing-header">
          <p className="plat-label">Pricing</p>
          <h2 className="plat-h2">Start free. Scale with confidence.</h2>
        </div>
      </Reveal>
      <Reveal stagger={0.15}>
        <div className="plat-pricing-grid">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`plat-pricing-card${tier.highlighted ? ' plat-pricing-card--highlighted' : ''}`}
            >
              <div className="plat-pricing-name">{tier.name}</div>
              <div className="plat-pricing-price">{tier.price}</div>
              <p className="plat-pricing-desc">{tier.desc}</p>
              <ul className="plat-pricing-features">
                {tier.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                href={tier.highlighted ? DEMO_HREF : '#'}
                className={`${tier.highlighted ? 'plat-btn-inverted' : 'plat-btn-primary'} plat-pricing-cta`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
