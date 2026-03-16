// ── Shared site content — single source of truth for human + machine views ──

// ── Navigation ──
export const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Proof', href: '#work' },
  { label: 'Contact', href: '#contact' },
] as const

// ── Contact / Email ──
export const CONTACT_EMAIL = 'gabor.soter@progressionlabs.com'
export const LINKEDIN_URL = 'https://linkedin.com/company/progressionlabs'

// ── Hero ──
export const HERO_CONTENT = {
  control: {
    headline: "We're building custom AI agents that scale for the most complex problems in the real world",
    cta: 'Request a brainstorm',
  },
  variant: {
    headline: 'Your team, supercharged with AI agents that actually ship to production',
    cta: 'Book a free strategy call',
  },
} as const

// ── CTA Section ──
export const CTA_CONTENT = {
  heading: 'Ready to build something extraordinary?',
  subheading: "Let's talk about what AI can do for your business.",
  cta: 'Request a brainstorm',
} as const

// ── Service Finder ──
export type Role = 'ceo' | 'cto' | 'product' | 'commercial' | 'other'
export type Journey = 'no_start' | 'know_what' | 'stuck' | 'need_hands' | 'scaling'

export interface Recommendation {
  title: string
  desc: string
  services: string[]
  cta: string
}

export const ROLES = [
  { id: 'ceo' as Role, label: 'CEO / Founder' },
  { id: 'cto' as Role, label: 'CTO / VP Engineering' },
  { id: 'product' as Role, label: 'Product Leader' },
  { id: 'commercial' as Role, label: 'Commercial Leader' },
  { id: 'other' as Role, label: 'Other' },
] as const

export const JOURNEYS = [
  { id: 'no_start' as Journey, label: "We haven't started with AI" },
  { id: 'know_what' as Journey, label: 'We know what we want to build' },
  { id: 'stuck' as Journey, label: "We started but hit a wall" },
  { id: 'need_hands' as Journey, label: "We're building, need more hands" },
  { id: 'scaling' as Journey, label: "We're live and need to scale" },
] as const

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  // ── CEO / Founder ──
  'ceo-no_start': {
    title: 'Find your highest-impact AI opportunity',
    desc: "You know AI matters, but it's hard to know where to start without wasting budget on the wrong thing. We run a focused strategy session with your leadership team and leave you with a clear, prioritised roadmap — not a slide deck.",
    services: ['AI Transformation', 'Ideation Sessions', 'AI Audit'],
    cta: 'Request a brainstorm',
  },
  'ceo-know_what': {
    title: 'Go from vision to production, fast',
    desc: "You've got the idea — now you need the team to build it properly. Our senior engineers embed alongside yours and ship production software from week one. You keep the code and the knowledge.",
    services: ['AI Builds', 'AI Expert'],
    cta: 'Request a brainstorm',
  },
  'ceo-stuck': {
    title: 'Get your AI project back on track',
    desc: "You've invested time and budget, and it's not delivering yet. That's more common than you'd think. We diagnose what stalled — architecture, data, team gaps — and fix it, usually within weeks.",
    services: ['Project Surgery', 'AI Expert', 'AI Audit'],
    cta: 'Request a brainstorm',
  },
  'ceo-need_hands': {
    title: 'Senior AI engineers, shipping from day one',
    desc: 'Hiring takes months. You need capacity now. Our engineers embed in your team immediately — no recruitment cycles, no ramp-up. They know the stack and start delivering from week one.',
    services: ['AI Expert', 'AI Builds'],
    cta: 'Request a brainstorm',
  },
  'ceo-scaling': {
    title: "Scale what's working without breaking it",
    desc: "Your AI is live and delivering value — now you need to expand without losing quality or velocity. We help you build the internal capability to scale independently, so you don't need us forever.",
    services: ['AI Transformation', 'AI Expert', 'AI Audit'],
    cta: 'Request a brainstorm',
  },

  // ── CTO / VP Engineering ──
  'cto-no_start': {
    title: 'AI Audit + Ideation Sessions',
    desc: 'Deep-dive technical assessment of your AI readiness — infrastructure, data, team skills. We deliver a prioritised roadmap your engineering team can execute.',
    services: ['AI Audit', 'Ideation Sessions'],
    cta: 'Get your audit',
  },
  'cto-know_what': {
    title: 'AI Builds + AI Expert',
    desc: 'Our senior engineers pair with yours to build production AI. Code you own, knowledge you keep. We handle the ML complexity so your team stays focused.',
    services: ['AI Builds', 'AI Expert'],
    cta: 'Start building',
  },
  'cto-stuck': {
    title: 'Project Surgery + AI Audit',
    desc: 'We diagnose the technical blockers — architecture, data pipeline, model performance, or integration issues — and get your project back on track with a clear fix.',
    services: ['Project Surgery', 'AI Audit', 'AI Expert'],
    cta: "Fix what's broken",
  },
  'cto-need_hands': {
    title: 'AI Expert + AI Builds',
    desc: 'Senior AI engineers who embed in your team and ship from day one. No recruitment cycles, no ramp-up — they know the stack and hit the ground running.',
    services: ['AI Expert', 'AI Builds'],
    cta: 'Add senior talent',
  },
  'cto-scaling': {
    title: 'AI Expert + AI Builds',
    desc: 'On-demand access to senior AI engineers who embed within your team. Scale your AI capability without the hiring lag.',
    services: ['AI Expert', 'AI Builds'],
    cta: 'Scale your team',
  },

  // ── Product Leader ──
  'product-no_start': {
    title: 'Ideation Sessions + AI Audit',
    desc: 'Structured workshops that turn product challenges into AI-powered features. Leave with prototyped concepts and a concrete action plan.',
    services: ['Ideation Sessions', 'AI Audit'],
    cta: 'Book a workshop',
  },
  'product-know_what': {
    title: 'AI Builds + AI Expert',
    desc: 'End-to-end AI product development. We work alongside your product team from spec to ship, building features your users will love.',
    services: ['AI Builds', 'AI Expert'],
    cta: 'Ship your feature',
  },
  'product-stuck': {
    title: 'Project Surgery + AI Builds',
    desc: "We diagnose why the feature stalled — scope, data, model fit, or UX — then rebuild with a clear path to ship. No more spinning wheels.",
    services: ['Project Surgery', 'AI Builds'],
    cta: 'Get unstuck',
  },
  'product-need_hands': {
    title: 'AI Expert + AI Builds',
    desc: 'Senior AI product engineers who slot into your team and ship features. They understand product thinking, not just model training.',
    services: ['AI Expert', 'AI Builds'],
    cta: 'Accelerate your roadmap',
  },
  'product-scaling': {
    title: 'AI Expert + AI Transformation',
    desc: 'Embed senior AI expertise into your product org. We help you build the processes and capabilities to ship AI features at scale.',
    services: ['AI Expert', 'AI Transformation'],
    cta: 'Level up your team',
  },

  // ── Commercial Leader ──
  'commercial-no_start': {
    title: 'AI Transformation + Ideation Sessions',
    desc: 'Understand where AI creates commercial value. We map opportunities across your business and help you build the case for investment.',
    services: ['AI Transformation', 'Ideation Sessions'],
    cta: 'Explore opportunities',
  },
  'commercial-know_what': {
    title: 'AI Builds + AI Transformation',
    desc: 'Turn commercial AI opportunities into working products. We build the tools and automations that drive revenue and efficiency.',
    services: ['AI Builds', 'AI Transformation'],
    cta: 'Build for growth',
  },
  'commercial-stuck': {
    title: 'Project Surgery + AI Transformation',
    desc: "We diagnose why your AI initiative isn't delivering commercial results — misaligned KPIs, wrong use case, or execution gaps — and course-correct.",
    services: ['Project Surgery', 'AI Transformation'],
    cta: 'Course-correct now',
  },
  'commercial-need_hands': {
    title: 'AI Builds + AI Expert',
    desc: 'More engineering capacity to ship your commercial AI projects. Our team builds the tools and integrations that drive measurable business impact.',
    services: ['AI Builds', 'AI Expert'],
    cta: 'Add capacity',
  },
  'commercial-scaling': {
    title: 'AI Transformation + AI Expert',
    desc: "Scale AI across your commercial operations. We help you expand what's working and build new AI-driven revenue streams.",
    services: ['AI Transformation', 'AI Expert'],
    cta: 'Scale your AI',
  },

  // ── Other ──
  'other-no_start': {
    title: 'AI Audit + Ideation Sessions',
    desc: "Start with a comprehensive assessment and hands-on workshop. We'll help you find the right starting point for your AI journey.",
    services: ['AI Audit', 'Ideation Sessions'],
    cta: 'Get started',
  },
  'other-know_what': {
    title: 'AI Builds + AI Expert',
    desc: 'Full-stack AI development with senior engineers. We build production-grade software tailored to your specific needs.',
    services: ['AI Builds', 'AI Expert'],
    cta: 'Start building',
  },
  'other-stuck': {
    title: 'Project Surgery + AI Audit',
    desc: "We diagnose what's blocking progress and chart a clear path forward. Fresh eyes and deep AI expertise to get things moving again.",
    services: ['Project Surgery', 'AI Audit'],
    cta: 'Get unstuck',
  },
  'other-need_hands': {
    title: 'AI Expert + AI Builds',
    desc: 'Experienced AI engineers who embed with your team. They ramp fast, ship real code, and transfer knowledge as they go.',
    services: ['AI Expert', 'AI Builds'],
    cta: 'Add AI talent',
  },
  'other-scaling': {
    title: 'AI Expert + AI Transformation',
    desc: 'Expert guidance to grow and optimise your AI operations. We embed senior talent and strategic advisory to help you scale.',
    services: ['AI Expert', 'AI Transformation'],
    cta: 'Scale with us',
  },
}

// ── Testimonials ──
export interface Testimonial {
  quote: string
  author: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "They've gone beyond just a number of engineers that I'm outsourcing AI for. They truly have been a thought partner, someone that's been very dependable and someone who helped us shape our strategy.",
    author: 'Dipak Patel',
    role: 'CEO of Globo',
  },
  {
    quote: "Progression Labs transformed our approach to AI implementation. Their team delivered beyond our expectations and helped us achieve results we didn't think were possible.",
    author: 'Sarah Chen',
    role: 'CTO of TechVentures',
  },
  {
    quote: 'Working with Progression Labs has been a game-changer. They brought deep expertise and a collaborative approach that made all the difference in our AI journey.',
    author: 'Michael Roberts',
    role: 'VP Engineering at DataFlow',
  },
]

// ── Blog Posts ──
export interface BlogPost {
  category: string
  date: string
  title: string
  excerpt: string
  image?: string
  video?: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    category: 'Engineering',
    date: '2026-02-28',
    title: 'Vibe Coding and the Death of Syntax',
    excerpt:
      'Karpathy coined it — programming via natural language, forgetting code exists. What this means for engineering teams and the future of software craft.',
    image: '/blog/vibe-coding.png',
    video: '/blog/blue-white-horse.mp4',
  },
  {
    category: 'Insights',
    date: '2026-02-12',
    title: 'Ghost Intelligence: Why LLMs Are Not What You Think',
    excerpt:
      'LLMs are "summoned ghosts", not gradually evolving animals. A fundamentally new type of intelligence that demands a new mental model.',
    image: '/blog/ghost-intelligence.png',
    video: '/blog/green-yellow-frog.mp4',
  },
  {
    category: 'Strategy',
    date: '2026-01-24',
    title: 'RLVR: The Quiet Revolution in How Models Learn to Reason',
    excerpt:
      'Reinforcement Learning from Verifiable Rewards — the shift from probabilistic imitation to logical reasoning that defined 2025.',
    image: '/blog/rlvr-revolution.png',
    video: '/blog/vibrant-green-flower.mp4',
  },
  {
    category: 'Process',
    date: '2026-01-08',
    title: 'The Magnitude 9 Earthquake: Engineering in the Agent Era',
    excerpt:
      'The profession is being dramatically refactored — agents, subagents, prompts, MCP, tools, plugins. How to ride the wave instead of drowning in it.',
    image: '/blog/magnitude-earthquake.png',
    video: '/blog/salmon-pink-jelly.mp4',
  },
]
