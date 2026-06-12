import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Images } from 'lucide-react'
import FloatingBubblesBackground from '@/components/ui/floating-bubbles-background'
import { Reveal } from '@/components/ui/reveal'
import { galleryCategories, getGalleryState, subscribeToCrmUpdates } from '@/lib/crmStore'

export default function FurGalleryPage({ onNavigate }) {
  const [gallery, setGallery] = useState(() => getGalleryState())
  const reduceMotion = useReducedMotion()

  useEffect(() => subscribeToCrmUpdates(() => setGallery(getGalleryState())), [])

  const galleryItems = useMemo(() => galleryCategories.flatMap((category) => {
    const images = gallery[category.id] || []
    if (!images.length) return []

    return images.map((image, index) => ({
      key: `${category.id}-${image.id}`,
      image: image.src,
      secondImage: image.secondSrc,
      petName: image.petName,
      caption: image.caption,
      index: index + 1,
    }))
  }), [gallery])

  return (
    <main className="fur-page" id="main">
      <FloatingBubblesBackground className="fur-page-bubbles" density={24} tone="blush" />
      <Reveal className="fur-page-hero">
        <a className="back-link" href="/" onClick={onNavigate?.('/')}><ArrowLeft /> Back to home</a>
        <p className="eyebrow">Fur Gallery</p>
        <h1>Meet the FlawLyss faces.</h1>
        <p>
          A collection of happy pets, fresh looks, and personalities worth showing off.
        </p>
      </Reveal>

      <section className="fur-results-panel" aria-label="Grooming result gallery">
        <div className="fur-results-intro">
          <span>Recent gallery</span>
        </div>
        <div className="fur-results-grid">
          {galleryItems.map((item, index) => (
            <motion.div
              className="gallery-result-reveal"
              key={item.key}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : Math.min(index, 5) * 0.06 }}
            >
              <article className="gallery-result-card">
                <div className={item.secondImage ? 'gallery-result-media has-two-images' : 'gallery-result-media'}>
                  <img src={item.image} alt={item.petName || item.caption || `Grooming gallery photo ${item.index}`} loading="lazy" />
                  {item.secondImage && <img src={item.secondImage} alt={`${item.petName || 'Pet'} gallery photo 2`} loading="lazy" />}
                </div>
                {(item.petName || item.caption) && (
                  <div className="gallery-result-copy">
                    {item.petName && <h2>{item.petName}</h2>}
                    {item.caption && <p>{item.caption}</p>}
                  </div>
                )}
              </article>
            </motion.div>
          ))}
          {!galleryItems.length && (
            <div className="fur-gallery-empty">
              <Images />
              <h2>Fresh transformations coming soon.</h2>
              <p>Alyssa is preparing new grooming results for the gallery.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
