'use client'

import Reveal from './Reveal'
import { PROBLEM_SECTION } from '../data/productContent'

export default function ProblemSection() {
  return (
    <section className="plat-problem">
      <Reveal>
        <p className="plat-label">{PROBLEM_SECTION.tag}</p>
        <h2 className="plat-h2">{PROBLEM_SECTION.heading}</h2>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="plat-body">{PROBLEM_SECTION.body}</p>
      </Reveal>
    </section>
  )
}
