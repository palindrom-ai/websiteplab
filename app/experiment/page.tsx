'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import HeroSection from './components/HeroSection'
import ExperimentNav from './components/ExperimentNav'
import LogoMarquee from './components/LogoMarquee'
import FindYourFit from './components/FindYourFit'
import ProofSection from './components/ProofSection'
import CTASection from './components/CTASection'
import BlogSection from './components/BlogSection'
import PlusDivider from './components/PlusDivider'
import PostHogTracker from './components/PostHogTracker'
import ViewModeToggle from './components/ViewModeToggle'
import ViewTransition from './components/ViewTransition'
import MachineView from './components/MachineView'
import { useViewMode } from './components/ViewModeProvider'

export default function ExperimentPage() {
  const navRef = useRef<HTMLElement>(null)
  const [showBrand, setShowBrand] = useState(false)
  const { viewMode, isMachine } = useViewMode()
  const prevModeRef = useRef(viewMode)

  // Force scroll to top on page load
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname)
    }
    window.scrollTo(0, 0)
  }, [])

  // Track scroll percentage continuously for cross-view mapping
  const scrollPctRef = useRef(0)
  useEffect(() => {
    const track = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollPctRef.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', track, { passive: true })
    track()
    return () => window.removeEventListener('scroll', track)
  }, [])

  // Hard-cut scroll sync: capture percentage before swap, apply after
  useEffect(() => {
    if (prevModeRef.current === viewMode) return
    const savedPct = scrollPctRef.current
    prevModeRef.current = viewMode

    // Stop Lenis so it doesn't fight the instant scroll
    const lenis = (window as any).__lenis
    if (lenis) lenis.stop()

    // Single rAF — display swap already happened synchronously in this render,
    // so the new view is laid out by the next frame
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      window.scrollTo(0, Math.round(savedPct * max))

      // Resume Lenis with fresh layout knowledge
      if (lenis) {
        lenis.resize()
        lenis.start()
      }
    })
  }, [viewMode])

  const handleNavReveal = useCallback(() => {
    if (navRef.current) {
      navRef.current.style.opacity = '1'
    }
  }, [])

  const handleBrandReveal = useCallback(() => {
    setShowBrand(true)
  }, [])

  return (
    <>
      <PostHogTracker />
      <ViewModeToggle />
      <ViewTransition />

      {/* Both views always mounted — hard cut via display swap in single render frame */}
      <div style={{ display: isMachine ? 'none' : 'contents' }}>
        <ExperimentNav ref={navRef} showBrand={showBrand} />
        <div data-section="hero">
          <HeroSection onNavReveal={handleNavReveal} onBrandReveal={handleBrandReveal} />
        </div>

        <div className="exp-logo-carousel">
          <LogoMarquee />
        </div>

        <PlusDivider />

        <section id="services" data-section="services">
          <FindYourFit />
        </section>

        <PlusDivider />

        <section id="work" data-section="work">
          <ProofSection />
        </section>

        <PlusDivider />

        <section id="lab" data-section="lab">
          <BlogSection />
        </section>

        <PlusDivider />

        <section id="contact" data-section="contact">
          <CTASection />
        </section>
      </div>

      <div style={{ display: isMachine ? 'contents' : 'none' }}>
        <MachineView />
      </div>
    </>
  )
}
