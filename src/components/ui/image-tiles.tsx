"use client"

import { motion, type Variants } from "framer-motion"
import React from "react"

interface ImageRevealProps {
  leftImage: string
  middleImage: string
  rightImage: string
  leftAlt?: string
  middleAlt?: string
  rightAlt?: string
}

export default function ImageReveal({
  leftImage,
  middleImage,
  rightImage,
  leftAlt = "Grooming result",
  middleAlt = "Grooming result",
  rightAlt = "Grooming result",
}: ImageRevealProps) {
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.1,
        staggerChildren: 0.16,
      },
    },
  }

  const leftImageVariants: Variants = {
    initial: { rotate: 0, x: 78, y: 0 },
    animate: {
      rotate: -8,
      x: 0,
      y: 10,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: -2,
      x: -8,
      y: 0,
      scale: 1.04,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const middleImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: 5,
      x: 0,
      y: -4,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 0,
      y: -14,
      scale: 1.04,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const rightImageVariants: Variants = {
    initial: { rotate: 0, x: -78, y: 0 },
    animate: {
      rotate: -6,
      x: 0,
      y: 14,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 2,
      x: 8,
      y: 4,
      scale: 1.04,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const imageClassName =
    "h-full w-full rounded-[18px] object-cover p-2"

  return (
    <motion.div
      className="image-tiles"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="image-tile image-tile-left"
        variants={leftImageVariants}
        whileHover="hover"
      >
        <img src={leftImage} alt={leftAlt} className={imageClassName} loading="lazy" />
      </motion.div>

      <motion.div
        className="image-tile image-tile-middle"
        variants={middleImageVariants}
        whileHover="hover"
      >
        <img src={middleImage} alt={middleAlt} className={imageClassName} loading="lazy" />
      </motion.div>

      <motion.div
        className="image-tile image-tile-right"
        variants={rightImageVariants}
        whileHover="hover"
      >
        <img src={rightImage} alt={rightAlt} className={imageClassName} loading="lazy" />
      </motion.div>
    </motion.div>
  )
}
