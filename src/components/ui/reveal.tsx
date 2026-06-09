"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { PropsWithChildren } from "react"

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
  distance?: number
}>

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
