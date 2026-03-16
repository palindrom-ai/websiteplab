'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      capture_pageview: true,
      capture_pageleave: true,
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
