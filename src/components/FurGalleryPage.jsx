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
      title: category.title,
      service: category.name,
      caption: category.caption,
      image: image.src,
      name: image.name,
      index: index + 1,
    }))
  }), [gallery])

  return (
    <main className="fur-page" id="main">
      <FloatingBubblesBackground className="fur-page-bubbles" density={24} tone="blush" />
      <Reveal className="fur-page-hero">
        <a className="back-link" href="/" onClick={onNavigate?.('/')}><ArrowLeft /> Back to home</a>
        <p className="eyebrow">Fur Gallery</p>
        <h1>Grooming results worth showing off.</h1>
        <p>
          Explore FlawLyss transformations by service type, from full haircuts
          to fresh brush-outs and tidy finishing trims.
        </p>
      </Reveal>

      <section className="fur-results-panel" aria-label="Grooming result gallery">
        <div className="fur-results-intro">
          <span>Recent transformations</span>
          <p>Each collection highlights a different finish, coat, and grooming style.</p>
        </div>
        <div className="fur-results-grid">
          {galleryItems.map((item) => (
            <Reveal className="gallery-result-reveal" key={item.key}>
              <article className="gallery-result-card">
                <div className="gallery-result-media">
                  <img src={item.image} alt={`${item.title} grooming result ${item.index}`} loading="lazy" />
                </div>
                <div className="gallery-result-copy">
                  <small>{item.service}</small>
                  <h2>{item.title}</h2>
                  <p>{item.caption}</p>
                  <span>{item.name}</span>
                </div>
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
