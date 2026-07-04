import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Framer Motion scroll reveal — expo-out curve to match the GSAP reveals. */
export default function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }} // --ease-out-expo
    >
      {children}
    </motion.div>
  )
}
