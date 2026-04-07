import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import './platform.css'
import SmoothScroll from '../experiment/components/SmoothScroll'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Cortex by Progression Labs — Auto-Improving Context Graphs for Enterprise',
  description:
    'Cortex captures decision traces to build self-improving context graphs that automate enterprise workflows. Deploy in weeks, not months.',
}

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`platform ${playfair.variable}`}>
      <SmoothScroll>
        {children}
      </SmoothScroll>
    </div>
  )
}
