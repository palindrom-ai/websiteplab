'use client'

import styles from './StepIcons.module.css'

interface StepIconsProps {
  /** Current finder step (0 = bounce stack, 1 = spreading rings) */
  step: number
}

export default function StepIcons({ step }: StepIconsProps) {
  return (
    <div className={styles.wrapper}>
      {/* Question 1: Bouncing Stack */}
      <svg
        className={`${styles.icon} ${step === 0 ? styles.active : ''}`}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stack-grad" gradientUnits="userSpaceOnUse" x1="100" y1="70" x2="100" y2="144">
            <stop offset="0%" className={styles.stopAccent} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        {/* All 3 share the same cy=130 so they rest as one flat shape */}
        <ellipse cx="100" cy="130" rx="45" ry="14" className={`${styles.stack} ${styles.stackBot}`} />
        <ellipse cx="100" cy="130" rx="45" ry="14" className={`${styles.stack} ${styles.stackMid}`} />
        <ellipse cx="100" cy="130" rx="45" ry="14" className={`${styles.stack} ${styles.stackTop}`} />
      </svg>

      {/* Question 2: Spreading Rings */}
      <svg
        className={`${styles.icon} ${step === 1 ? styles.active : ''}`}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="rings-grad" gradientUnits="userSpaceOnUse" x1="100" y1="68" x2="100" y2="132">
            <stop offset="0%" className={styles.stopAccent} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="32" className={`${styles.ring} ${styles.ring1}`} />
        <circle cx="100" cy="100" r="32" className={`${styles.ring} ${styles.ring2}`} />
        <circle cx="100" cy="100" r="32" className={`${styles.ring} ${styles.ring3}`} />
        <circle cx="100" cy="100" r="32" className={`${styles.ring} ${styles.ring4}`} />
      </svg>
    </div>
  )
}
