'use client'

import Reveal from './Reveal'
import { USE_CASES } from '../data/productContent'

export default function UseCasesSection() {
  return (
    <section className="plat-usecases" id="use-cases">
      <Reveal>
        <div className="plat-usecases-header">
          <p className="plat-label">Use Cases</p>
          <h2 className="plat-h2">Where context changes everything</h2>
          <p className="plat-body">
            Exception-heavy decisions where logic is complex, precedent matters,
            and outcomes depend on cross-functional context.
          </p>
        </div>
      </Reveal>
      <Reveal stagger={0.1}>
        <div className="plat-usecases-grid">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className="plat-usecase-card">
              <h3 className="plat-usecase-title">{uc.title}</h3>
              <p className="plat-usecase-desc">{uc.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
