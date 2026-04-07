'use client'

import PlatformNav from './components/PlatformNav'
import PlatformHero from './components/PlatformHero'
// LogoStrip removed per feedback
import ProblemSection from './components/ProblemSection'
import FeaturesGrid from './components/FeaturesGrid'
import IntegrationSection from './components/IntegrationSection'
import UseCasesSection from './components/UseCasesSection'
import StatsStrip from './components/StatsStrip'
import PricingSection from './components/PricingSection'
import PlatformCTA from './components/PlatformCTA'

export default function PlatformPage() {
  return (
    <>
      <PlatformNav />
      <PlatformHero />

      <hr className="plat-divider" />

      <ProblemSection />
      <FeaturesGrid />

      <hr className="plat-divider" />
      <IntegrationSection />
      <hr className="plat-divider" />

      <UseCasesSection />
      <StatsStrip />

      <hr className="plat-divider" />
      <PricingSection />

      {/* CTA + footer are dark bg — no divider needed */}
      <PlatformCTA />
    </>
  )
}
