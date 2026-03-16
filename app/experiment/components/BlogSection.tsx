'use client'

import { useEffect, useRef, useCallback } from 'react'
import ScrollDecode from './ScrollDecode'
import { BLOG_POSTS } from '../data/siteContent'

const posts = BLOG_POSTS

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget.querySelector('video')
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const video = e.currentTarget.querySelector('video')
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }, [])

  useEffect(() => {
    let ctx: { revert: () => void } | null = null

    const initGsap = async () => {
      const { default: gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const el = sectionRef.current
      if (!el) return

      const cards = el.querySelectorAll('.exp-blog-card')
      if (cards.length === 0) return

      ctx = gsap.context(() => {
        gsap.set(cards, { opacity: 0 })
        gsap.to(cards, {
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })
    }

    initGsap()
    return () => { ctx?.revert() }
  }, [])

  return (
    <div ref={sectionRef} className="exp-blog-section">
      <div className="exp-blog-header">
        <div className="exp-tag">Blog</div>
        <ScrollDecode
          text="From the Lab"
          trigger="inView"
          tag="h2"
          className="exp-section-heading"
          duration={800}
        />
      </div>

      <div className="exp-blog-grid">
        {posts.map((post) => (
          <a
            key={post.title}
            href="#"
            className="exp-blog-card"
            onMouseEnter={post.video ? handleMouseEnter : undefined}
            onMouseLeave={post.video ? handleMouseLeave : undefined}
          >
            <div className="exp-blog-image">
              {post.video ? (
                <video
                  src={post.video}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="exp-blog-video exp-blog-video--visible"
                />
              ) : post.image ? (
                <img src={post.image} alt="" loading="lazy" />
              ) : null}
            </div>
            <div className="exp-blog-body">
              <span className="exp-blog-category">{post.category}</span>
              <h3 className="exp-blog-title">{post.title}</h3>
              <p className="exp-blog-excerpt">{post.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
