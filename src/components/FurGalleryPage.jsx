import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Images } from 'lucide-react'
import FloatingBubblesBackground from '@/components/ui/floating-bubbles-background'
import ImageReveal from '@/components/ui/image-tiles'
import { Reveal } from '@/components/ui/reveal'
import { galleryCategories, getGalleryState, subscribeToCrmUpdates } from '@/lib/crmStore'

export default function FurGalleryPage() {
  const [gallery, setGallery] = useState(() => getGalleryState())

  useEffect(() => subscribeToCrmUpdates(() => setGallery(getGalleryState())), [])

  const galleryItems = useMemo(() => galleryCategories.flatMap((category) => {
    const images = gallery[category.id] || []
    if (!images.length) return []

    const groups = []
    for (let index = 0; index < images.length; index += 3) {
      const group = images.slice(index, index + 3)
      while (group.length < 3) group.push(group[group.length - 1] || images[0])
      groups.push({
        key: `${category.id}-${index}`,
        title: groups.length ? `${category.title} ${groups.length + 1}` : category.title,
        service: category.name,
        caption: category.caption,
        images: group.map((image) => image.src),
      })
    }
    return groups
  }), [gallery])

  return (
    <main className="fur-page" id="main">
      <FloatingBubblesBackground className="fur-page-bubbles" density={24} tone="blush" />
      <Reveal className="fur-page-hero">
        <a className="back-link" href="/"><ArrowLeft /> Back to home</a>
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
            <div className="gallery-result-reveal" key={item.key}>
              <article className="gallery-result-card">
                <div className="gallery-result-tiles">
                  <ImageReveal
                    leftImage={item.images[0]}
                    middleImage={item.images[1]}
                    rightImage={item.images[2]}
                    leftAlt={`${item.title} grooming result one`}
                    middleAlt={`${item.title} grooming result two`}
                    rightAlt={`${item.title} grooming result three`}
                  />
                </div>
                <div className="gallery-result-copy">
                  <small>{item.service}</small>
                  <h2>{item.title}</h2>
                  <p>{item.caption}</p>
                </div>
              </article>
            </div>
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
