// ── Cortex Product Page — Single source of truth for all copy ──

// ── Navigation ──
export const PRODUCT_NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
] as const

// ── Contact ──
export const DEMO_EMAIL = 'gabor.soter@progressionlabs.com'
export const DEMO_SUBJECT = 'Cortex Demo Request'
export const DEMO_HREF = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(DEMO_SUBJECT)}`

// ── Hero ──
export const PRODUCT_HERO = {
  headline: 'The context layer your AI agents actually need',
  subheadline:
    'Cortex captures decision traces across your organization and builds a self-improving context graph that continuously A/B tests and optimizes your workflows. The more decisions flow through it, the smarter it gets.',
  primaryCta: 'Request a Demo',
  secondaryCta: 'View Documentation',
} as const

// ── Logo Strip ──
export const LOGO_STRIP = {
  label: 'Trusted by teams at',
  logos: [
    { src: '/logos/mckinsey.png', alt: 'McKinsey' },
    { src: '/logos/palantir.svg', alt: 'Palantir' },
    { src: '/logos/spotify.png', alt: 'Spotify' },
    { src: '/logos/quantumblack.png', alt: 'QuantumBlack' },
    { src: '/logos/ib.png', alt: 'International Baccalaureate' },
  ],
} as const

// ── Problem ──
export const PROBLEM_SECTION = {
  tag: 'The Problem',
  heading: 'Your tools capture what happened. Cortex captures why.',
  body: 'Data warehouses and CRMs record outcomes after the fact. But the reasoning, context, and institutional knowledge behind every business decision disappears the moment it happens. Cortex sits in the orchestration path, not the read path, capturing decision traces at commit time so nothing is lost.',
} as const

// ── Features ──
export const FEATURES = [
  {
    id: '01',
    title: 'Decision Traces',
    desc: 'Capture the full context behind every business decision: who approved it, what policies applied, what exceptions were granted, and why.',
  },
  {
    id: '02',
    title: 'Continuous A/B Optimization',
    desc: 'Cortex autonomously generates and runs A/B tests on decision workflows, surfacing which approval paths, routing rules, and escalation patterns deliver the best outcomes. Your operations improve while you sleep.',
  },
  {
    id: '03',
    title: 'Self-Improving Context Graph',
    desc: 'Every decision enriches the graph. Every enrichment improves the next recommendation. Cortex gets smarter with every interaction, building a compounding advantage unique to your organization.',
  },
  {
    id: '04',
    title: 'Orchestration-Path Native',
    desc: 'Unlike read-path analytics that rely on stale ETL data, Cortex operates where decisions happen. Context captured at commit time, not retroactively via ETL.',
  },
  {
    id: '05',
    title: 'Enterprise Integration',
    desc: 'Deploy alongside your existing stack. Pre-built connectors for Salesforce, Zendesk, Jira, Slack, PagerDuty, and 100+ enterprise tools.',
  },
] as const

// ── Use Cases ──
export const USE_CASES = [
  {
    title: 'Contract Review',
    desc: 'Surface precedents, flag deviations, and recommend terms based on your full decision history.',
  },
  {
    title: 'Quote-to-Cash',
    desc: 'Accelerate deal cycles with context-aware pricing, approval routing, and margin optimization from every past transaction.',
  },
  {
    title: 'Support Resolution',
    desc: 'Resolve tickets faster by tracing similar issues, surfacing root causes, and recommending actions from institutional knowledge.',
  },
  {
    title: 'Ticket Escalation',
    desc: 'Intelligently route and prioritize based on decision traces, understanding urgency, customer context, and team capacity.',
  },
] as const

// ── Stats ──
export const STATS = [
  { value: '60%', label: 'Faster decision cycles' },
  { value: '3x', label: 'Context retention' },
  { value: '< 2 wks', label: 'Time to deploy' },
  { value: '99.9%', label: 'Uptime SLA' },
] as const

// ── Pricing ──
export const PRICING_TIERS = [
  {
    name: 'Community',
    price: 'Free',
    desc: 'For teams exploring context-aware automation.',
    features: [
      'Up to 5 users',
      'Core graph engine',
      '1,000 decision traces / mo',
      'Community support',
      'Standard connectors',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    desc: 'For organizations ready to deploy at scale.',
    features: [
      'Unlimited users',
      'Full graph engine + AI',
      'Unlimited decision traces',
      'Dedicated support + SLA',
      'Custom connectors + SSO',
      'On-premise deployment',
      'SOC 2 Type II compliant',
    ],
    cta: 'Request a Demo',
    highlighted: true,
  },
] as const

// ── CTA ──
export const PRODUCT_CTA = {
  heading: 'Ready to capture the context behind every decision?',
  subheading:
    'Deploy Cortex in weeks, not months. Start with the free community edition or talk to us about enterprise.',
  cta: 'Request a Demo',
} as const
