'use client'

import Reveal from './Reveal'
import { FEATURES } from '../data/productContent'
import {
  DecisionTraceIcon,
  ABTestIcon,
  FlywheelIcon,
  OrchestrationIcon,
  IntegrationIcon,
} from './FeatureIcon'

const ICONS = [
  <DecisionTraceIcon key="dt" />,
  <ABTestIcon key="ab" />,
  <FlywheelIcon key="fw" />,
  <OrchestrationIcon key="or" />,
  <IntegrationIcon key="in" />,
]

export default function FeaturesGrid() {
  return (
    <section className="plat-features" id="features">
      <Reveal stagger={0.12}>
        {FEATURES.map((f, i) => (
          <div key={f.id} className="plat-feature-card">
            <div className="plat-feature-icon-wrap">
              {ICONS[i]}
            </div>
            <div className="plat-feature-text">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
