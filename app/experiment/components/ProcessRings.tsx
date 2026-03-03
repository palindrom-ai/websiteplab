'use client'

import styles from './ProcessRings.module.css'

interface ProcessRingsProps {
  /** Total width/height of the ring area in px (default 60) */
  size?: number
  /** Whether to show the "Process" label (default true) */
  showLabel?: boolean
}

export default function ProcessRings({ size, showLabel = true }: ProcessRingsProps) {
  return (
    <div
      className={styles.container}
      style={size ? { '--pr-size': `${size}px` } as React.CSSProperties : undefined}
    >
      <div className={styles.ringWrapper}>
        <div className={`${styles.ring} ${styles.ring1}`} />
        <div className={`${styles.ring} ${styles.ring2}`} />
        <div className={`${styles.ring} ${styles.ring3}`} />
        <div className={`${styles.ring} ${styles.ring4}`} />
      </div>
      {showLabel && <div className={styles.label}>Process</div>}
    </div>
  )
}
