'use client'

/* ─────────────────────────────────────────────
   Animated SVG icons for feature cards.
   Each has a subtle CSS animation.
   ───────────────────────────────────────────── */

export function DecisionTraceIcon() {
  return (
    <svg className="plat-feature-icon plat-icon-pulse" width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Branching decision tree */}
      <circle cx="24" cy="8" r="4" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="24" y1="12" x2="24" y2="20" stroke="#D97706" strokeWidth="1.5" />
      <line x1="24" y1="20" x2="14" y2="28" stroke="#D97706" strokeWidth="1.5" />
      <line x1="24" y1="20" x2="34" y2="28" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="14" cy="32" r="4" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <circle cx="34" cy="32" r="4" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="14" y1="36" x2="14" y2="42" stroke="#D97706" strokeWidth="1.5" opacity="0.4" />
      <line x1="34" y1="36" x2="34" y2="42" stroke="#D97706" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

export function FlywheelIcon() {
  return (
    <svg className="plat-feature-icon plat-icon-spin" width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Circular flywheel with arrows */}
      <circle cx="24" cy="24" r="16" stroke="#D97706" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M24 8 A16 16 0 0 1 40 24" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <polygon points="39,20 43,24 39,28" fill="#D97706" opacity="0.6" />
      <path d="M40 24 A16 16 0 0 1 24 40" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M24 40 A16 16 0 0 1 8 24" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="24" cy="24" r="4" fill="#D97706" opacity="0.15" />
      <circle cx="24" cy="24" r="2" fill="#D97706" opacity="0.3" />
    </svg>
  )
}

export function OrchestrationIcon() {
  return (
    <svg className="plat-feature-icon plat-icon-pulse" width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Central node with radiating connections */}
      <circle cx="24" cy="24" r="6" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="24" y1="6" x2="24" y2="18" stroke="#D97706" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="30" x2="24" y2="42" stroke="#D97706" strokeWidth="1" opacity="0.5" />
      <line x1="6" y1="24" x2="18" y2="24" stroke="#D97706" strokeWidth="1" opacity="0.5" />
      <line x1="30" y1="24" x2="42" y2="24" stroke="#D97706" strokeWidth="1" opacity="0.5" />
      <circle cx="24" cy="6" r="3" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="24" cy="42" r="3" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="6" cy="24" r="3" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="42" cy="24" r="3" stroke="#D97706" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Lightning bolt in center — "at commit time" */}
      <path d="M26 20 L22 25 L26 25 L22 30" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ABTestIcon() {
  return (
    <svg className="plat-feature-icon plat-icon-pulse" width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* A/B split — two paths diverging then reconverging */}
      <line x1="8" y1="24" x2="16" y2="24" stroke="#D97706" strokeWidth="1.5" />
      <path d="M16 24 Q24 10 32 18" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <path d="M16 24 Q24 38 32 30" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="32" y1="18" x2="40" y2="24" stroke="#D97706" strokeWidth="1.5" />
      <line x1="32" y1="30" x2="40" y2="24" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="40" cy="24" r="3" stroke="#D97706" strokeWidth="1.5" fill="none" />
      {/* A and B labels */}
      <text x="28" y="15" fill="#D97706" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.6">A</text>
      <text x="28" y="37" fill="#D97706" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0.6">B</text>
    </svg>
  )
}

export function IntegrationIcon() {
  return (
    <svg className="plat-feature-icon plat-icon-float" width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Plug / connector symbol */}
      <rect x="12" y="16" width="10" height="16" rx="2" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <rect x="26" y="16" width="10" height="16" rx="2" stroke="#D97706" strokeWidth="1.5" fill="none" />
      <line x1="22" y1="22" x2="26" y2="22" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="26" x2="26" y2="26" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="30" x2="26" y2="30" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      {/* External lines going outward */}
      <line x1="12" y1="24" x2="4" y2="24" stroke="#D97706" strokeWidth="1" opacity="0.4" />
      <line x1="36" y1="24" x2="44" y2="24" stroke="#D97706" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}
