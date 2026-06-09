"use client"

import React from "react"
import { ArrowRight, Heart } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import FloatingBubblesBackground from "@/components/ui/floating-bubbles-background"
import { cn } from "@/lib/utils"

interface AnimatedMarqueeHeroProps {
  tagline: string
  title: React.ReactNode
  description: string
  ctaText: string
  ctaHref?: string
  secondaryText?: string
  secondaryHref?: string
  images: string[]
  bannerImage?: string
  className?: string
}

const fadeInAnimationVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 95, damping: 20 },
  },
}

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref = "#booking",
  secondaryText = "Explore our services",
  secondaryHref = "#services",
  images,
  bannerImage,
  className,
}) => {
  const reduceMotion = useReducedMotion()
  const duplicatedImages = [...images, ...images]

  return (
    <section
      id="home"
      className={cn(
        "relative isolate flex min-h-[880px] w-full flex-col overflow-hidden bg-[#fff1d8] px-5 pb-72 pt-12 text-[#2d1557] md:min-h-[940px] md:px-12 md:pb-80 md:pt-16 lg:px-20",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(238,66,125,0.12),transparent_26%),linear-gradient(135deg,#fffdf8_0%,#fff1d8_62%,#ffd9a6_100%)]" />
      <FloatingBubblesBackground
        className="z-0 opacity-80"
        density={14}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1380px] grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeInAnimationVariants}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ee427d]/25 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ee427d] shadow-sm backdrop-blur-md"
          >
            <Heart className="h-4 w-4 fill-current" />
            {tagline}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09 } },
            }}
            className="!mb-6 !max-w-[760px] !font-['Playfair_Display'] !text-[clamp(3.3rem,7.2vw,7.4rem)] !leading-[0.92] !tracking-[-0.055em] text-[#2d1557]"
          >
            {typeof title === "string"
              ? title.split(" ").map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={fadeInAnimationVariants}
                    className="mr-[0.22em] inline-block last:mr-0"
                  >
                    {word}
                  </motion.span>
                ))
              : title}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeInAnimationVariants}
            transition={{ delay: 0.38 }}
            className="!mb-0 max-w-xl text-base leading-7 text-[#2f174f]/70 md:text-lg"
          >
            {description}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeInAnimationVariants}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <motion.a
              href={ctaHref}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ee427d] px-7 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(238,66,125,0.28)] transition-colors hover:bg-[#2d1557] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#f8b713]"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <a
              href={secondaryHref}
              className="inline-flex min-h-11 items-center gap-2 border-b border-[#2d1557] text-sm font-bold transition-colors hover:border-[#ee427d] hover:text-[#ee427d]"
            >
              {secondaryText}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        {bannerImage && (
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 1.5 }}
            animate={{ opacity: 1, x: 0, rotate: -1.2 }}
            transition={{ duration: 0.75, delay: 0.16, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[760px]"
          >
            <div className="overflow-hidden rounded-[28px_90px_28px_90px] border-[7px] border-white/90 bg-white shadow-[0_28px_75px_rgba(45,21,87,0.18)]">
              <img
                src={bannerImage}
                alt="FlawLyss Grooming, where every pet leaves flawless"
                className="aspect-[2/1] h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 text-xs shadow-xl backdrop-blur-md">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff1d8] text-lg">
                <Heart className="h-4 w-4 fill-[#ee427d] text-[#ee427d]" />
              </span>
              <span>
                <strong className="block text-[#2d1557]">Loved by local pets</strong>
                <span className="text-[#2d1557]/60">Gentle care, happy tails</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 h-64 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_90%)] md:h-72">
        <motion.div
          className="flex w-max gap-4 px-4 pt-8"
          animate={reduceMotion ? undefined : { x: ["-50%", "0%"] }}
          transition={{
            ease: "linear",
            duration: 42,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {duplicatedImages.map((src, index) => {
            return (
              <div
                key={`${src}-${index}`}
                className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-white/80 bg-white shadow-[0_16px_36px_rgba(45,21,87,0.18)] md:h-60 md:w-48"
                style={{ rotate: `${index % 2 === 0 ? -2 : 3}deg` }}
              >
                <img
                  src={src}
                  alt=""
                  loading={index < images.length ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-[#2d1557]/82 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {index % 3 === 0 ? "Personal care" : index % 3 === 1 ? "Before" : "FlawLyss"}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
