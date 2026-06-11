import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Images } from 'lucide-react'
import FloatingBubblesBackground from '@/components/ui/floating-bubbles-background'
import { Reveal } from '@/components/ui/reveal'
import { galleryCategories, getGalleryState, subscribeToCrmUpdates } from '@/lib/crmStore'

export default function FurGalleryPage({ onNavigate }) {
  const [gallery, setGallery] = useState(() => getGalleryState())

  useEffect(() => subscribeToCrmUpdates(() => setGallery(getGalleryState())), [])

  const galleryItems = useMemo(() => galleryCategories.flatMap((category) => {
    const images = gallery[category.id] || []
    if (!images.length) return []

    return images.map((image, index) => ({
      key: `${category.id}-${image.id}`,
      image: image.src,
      caption: image.name,
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
          <p>Each photo can include the pet’s name or a short caption.</p>
        </div>
        <div className="fur-results-grid">
          {galleryItems.map((item) => (
            <Reveal className="gallery-result-reveal" key={item.key}>
              <article className="gallery-result-card">
                <div className="gallery-result-media">
                  <img src={item.image} alt={item.caption || `Grooming gallery photo ${item.index}`} loading="lazy" />
                </div>
                {item.caption && <p className="gallery-result-caption">{item.caption}</p>}
              </article>
            </Reveal>
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
