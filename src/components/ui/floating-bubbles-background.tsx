"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type BubbleData = {
  id: number
  x: number
  y: number
  size: number
  driftX: number
  driftY: number
  duration: number
  delay: number
  color: string
}

type FloatingBubblesBackgroundProps = {
  className?: string
  density?: number
  tone?: "light" | "dark" | "blush"
}

const lightColors = [
  "rgba(238, 66, 125, 0.20)",
  "rgba(245, 107, 153, 0.16)",
  "rgba(248, 183, 19, 0.14)",
  "rgba(45, 21, 87, 0.10)",
]

const darkColors = [
  "rgba(255, 255, 255, 0.16)",
  "rgba(245, 107, 153, 0.25)",
  "rgba(255, 217, 166, 0.18)",
  "rgba(248, 183, 19, 0.16)",
]

const blushColors = [
  "rgba(67, 32, 111, 0.18)",
  "rgba(45, 21, 87, 0.12)",
  "rgba(238, 66, 125, 0.16)",
  "rgba(255, 255, 255, 0.42)",
]

function seededRandom(seed: number) {
  const value = Math.sin(seed * 999) * 10000
  return value - Math.floor(value)
}

function createBubbles(density: number, tone: "light" | "dark" | "blush") {
  const colors =
    tone === "dark" ? darkColors : tone === "blush" ? blushColors : lightColors

  return Array.from({ length: density }, (_, index): BubbleData => {
    const seed = index + (tone === "dark" ? 101 : tone === "blush" ? 211 : 1)

    return {
      id: index,
      x: seededRandom(seed) * 1000,
      y: seededRandom(seed + 11) * 700,
      size: 7 + seededRandom(seed + 23) * 24,
      driftX: -32 + seededRandom(seed + 37) * 64,
      driftY: -38 + seededRandom(seed + 51) * 76,
      duration: 7 + seededRandom(seed + 67) * 7,
      delay: seededRandom(seed + 79) * -8,
      color: colors[index % colors.length],
    }
  })
}

function Bubble({
  bubble,
  reduceMotion,
}: {
  bubble: BubbleData
  reduceMotion: boolean | null
}) {
  return (
    <motion.circle
      cx={bubble.x}
      cy={bubble.y}
      r={bubble.size}
      fill={bubble.color}
      stroke="rgba(255,255,255,0.42)"
      strokeWidth="1.25"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={
        reduceMotion
          ? { opacity: 0.45, scale: 1 }
          : {
              opacity: [0.22, 0.68, 0.22],
              scale: [0.92, 1.12, 0.92],
              x: [0, bubble.driftX, 0],
              y: [0, bubble.driftY, 0],
            }
      }
      transition={{
        duration: reduceMotion ? 0.2 : bubble.duration,
        delay: reduceMotion ? 0 : bubble.delay,
        repeat: reduceMotion ? 0 : Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
      style={{ transformOrigin: `${bubble.x}px ${bubble.y}px` }}
    />
  )
}

export default function FloatingBubblesBackground({
  className,
  density = 16,
  tone = "light",
}: FloatingBubblesBackgroundProps) {
  const reduceMotion = useReducedMotion()
  const bubbles = useMemo(
    () => createBubbles(Math.max(1, Math.min(density, 30)), tone),
    [density, tone],
  )

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} bubble={bubble} reduceMotion={reduceMotion} />
        ))}
      </svg>
    </div>
  )
}
