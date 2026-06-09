import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Bath,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Instagram,
  LockKeyhole,
  Mail,
  Menu,
  PawPrint,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import FurGalleryPage from './components/FurGalleryPage'
import AdminDashboard from './components/AdminDashboard'
import FloatingBubblesBackground from '@/components/ui/floating-bubbles-background'
import { Reveal } from '@/components/ui/reveal'
import {
  galleryCategories,
  getGalleryState,
  getHomepageMedia,
  saveBookingRequest,
  subscribeToCrmUpdates,
} from '@/lib/crmStore'

const services = [
  {
    icon: Bath,
    title: 'Bath & Brush',
    type: 'Grooming package',
    description: 'A gentle bath followed by a thorough brush-out to leave the coat clean, fresh, and comfortable.',
    finish: 'Clean, airy & soft',
    bestFor: 'Coat maintenance and seasonal shedding',
    mediaSlot: 'service-bath-brush',
  },
  {
    icon: Scissors,
    title: 'Bath & Full Haircut',
    type: 'Grooming package',
    description: 'A complete bath and full haircut customized to your pet’s coat, comfort, and preferred style.',
    finish: 'Shaped, balanced & polished',
    bestFor: 'Full transformations and coat resets',
    mediaSlot: 'service-full-haircut',
  },
  {
    icon: Sparkles,
    title: 'Bath & Trim',
    type: 'Grooming package',
    description: 'A refreshing bath with a tidy-up trim around the face, feet, sanitary areas, and other needed areas.',
    finish: 'Natural shape, freshly detailed',
    bestFor: 'Face, feet, and high-impact tidy-ups',
    mediaSlot: 'service-bath-trim',
  },
  {
    icon: Scissors,
    title: 'Nail Trim',
    type: 'Standalone service',
    description: 'Careful nail trimming to help keep your pet comfortable and their paws healthy.',
    finish: 'Comfortable, tidy paws',
    bestFor: 'Routine paw care',
    mediaSlot: 'service-nail-trim',
  },
  {
    icon: Sparkles,
    title: 'Nail Grind',
    type: 'Standalone service',
    description: 'Nails are gently ground and smoothed to soften sharp edges and create a shorter finish.',
    finish: 'Smooth, softened edges',
    bestFor: 'Pets needing a refined nail finish',
    mediaSlot: 'service-nail-grind',
  },
  {
    icon: ShieldCheck,
    title: 'Teeth Brushing',
    type: 'Standalone service',
    description: 'A gentle brushing service to freshen your pet’s breath and support routine dental care.',
    finish: 'Freshened routine care',
    bestFor: 'Adding oral care to an appointment',
    mediaSlot: 'service-teeth',
  },
  {
    icon: Heart,
    title: 'Ear Cleaning / Plucking',
    type: 'Standalone service',
    description: 'Careful ear cleaning and plucking where appropriate for your pet’s needs and comfort.',
    finish: 'Clean and carefully tended',
    bestFor: 'Routine ear maintenance',
    mediaSlot: 'service-ears',
  },
]

function App() {
  const isFurGalleryPage = window.location.pathname === '/fur-gallery'
  const isAdminPage = window.location.pathname.startsWith('/admin')
  const [menuOpen, setMenuOpen] = useState(false)
  const [slider, setSlider] = useState(50)
  const [activeService, setActiveService] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [selectedAnimal, setSelectedAnimal] = useState('')
  const [gallery, setGallery] = useState(() => getGalleryState())
  const [homepageMedia, setHomepageMediaState] = useState(() => getHomepageMedia())
  const journalVideoRef = useRef(null)

  useEffect(() => subscribeToCrmUpdates(() => {
    setGallery(getGalleryState())
    setHomepageMediaState(getHomepageMedia())
  }), [])

  useEffect(() => {
    const video = journalVideoRef.current
    if (!video) return

    const playVideo = () => {
      video.play().catch(() => {})
    }

    if (video.readyState >= 3) {
      playVideo()
      return
    }

    video.addEventListener('canplay', playVideo, { once: true })
    return () => video.removeEventListener('canplay', playVideo)
  }, [homepageMedia['journal-video']?.src])

  const galleryPreview = useMemo(() => galleryCategories.map((category) => ({
    ...category,
    image: gallery[category.id]?.[0]?.src || category.defaultImages[0],
    count: gallery[category.id]?.length || 0,
  })), [gallery])

  const selectedService = services[activeService]

  const closeMenu = () => setMenuOpen(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const request = Object.fromEntries(new FormData(event.currentTarget).entries())
    saveBookingRequest(request)
    setSubmitted(true)
    event.currentTarget.reset()
    setSelectedAnimal('')
  }

  if (isAdminPage) return <AdminDashboard />

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="header">
        <a className="brand" href="/" onClick={closeMenu} aria-label="FlawLyss Grooming home">
          <img src={homepageMedia.logo.src} alt="" />
          <span><strong>FlawLyss</strong> Grooming</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          <a href="/#services" onClick={closeMenu}>Services</a>
          <a href="/fur-gallery" onClick={closeMenu}>Fur Gallery</a>
          <a href="/#studio" onClick={closeMenu}>Meet Alyssa</a>
          <a href="/#contact" onClick={closeMenu}>Contact Us</a>
          <a className="nav-cta" href="/#booking" onClick={closeMenu}>Book an appointment</a>
        </nav>
      </header>

      {isFurGalleryPage ? (
        <FurGalleryPage />
      ) : (
      <main id="main">
        <section className="banner-hero" id="home" aria-label="FlawLyss Grooming">
          <img
            src={homepageMedia['hero-banner'].src}
            alt="FlawLyss Grooming. Where every pet leaves flawless. Professional care, happy pets, and competitive prices."
            fetchPriority="high"
          />
        </section>

        <section className="journal-opening" aria-labelledby="journal-title">
          <div className="journal-issue">FlawLyss Journal · Issue 01</div>
          <Reveal className="journal-opening-copy">
            <p className="eyebrow">More than a fresh haircut</p>
            <h1 id="journal-title">A groom should feel<br /><em>as good as it looks.</em></h1>
          </Reveal>
          <Reveal className="journal-opening-note" delay={0.1}>
            <span className="journal-dropcap">E</span>
            <p>very appointment is shaped around the pet in front of us: their coat, their comfort, their personality, and the little details that make them unmistakably themselves.</p>
          </Reveal>
          <Reveal className="journal-video-card" delay={0.14}>
            <video
              ref={journalVideoRef}
              src={homepageMedia['journal-video'].src}
              poster="/grooming-placeholder-poster.jpg"
              preload="auto"
              autoPlay
              muted
              loop
              playsInline
              aria-label="A freshly groomed dog receiving its final comb-through"
            />
            <div className="journal-video-caption"><span>The finished look</span><strong>Fresh, polished, and ready to go.</strong></div>
          </Reveal>
          <div className="journal-scribble scribble-one">care at their pace</div>
          <div className="journal-scribble scribble-two">made personal</div>
        </section>

        <section className="transformation-story" id="featured-transformation">
          <FloatingBubblesBackground className="bubble-layer journal-bubbles" density={14} tone="blush" />
          <div className="transformation-head">
            <Reveal>
              <p className="eyebrow">The cover groom</p>
              <h2>From overgrown<br />to <em>oh-so-soft.</em></h2>
            </Reveal>
            <p className="transformation-index">01 / Transformation study</p>
          </div>
          <div className="transformation-layout">
            <Reveal className="transformation-stage">
              <div className="before-after">
                <div className="comparison-image before" style={{ backgroundImage: `url("${homepageMedia['transformation-before'].src}")` }} aria-hidden="true" />
                <div className="comparison-image after" style={{ backgroundImage: `url("${homepageMedia['transformation-after'].src}")`, clipPath: `inset(0 0 0 ${slider}%)` }} aria-hidden="true" />
                <div className="image-label before-label">Before</div>
                <div className="image-label after-label">After</div>
                <div className="slider-line" style={{ left: `${slider}%` }}><span><ChevronLeft /><ChevronRight /></span></div>
                <input className="comparison-range" type="range" min="0" max="100" value={slider} onChange={(event) => setSlider(Number(event.target.value))} aria-label="Move slider to compare before and after grooming" />
              </div>
              <div className="polaroid-note"><Sparkles /> drag to reveal the finish</div>
            </Reveal>
            <Reveal className="grooming-receipt" delay={0.12}>
              <div className="receipt-top"><PawPrint /><span>FlawLyss Grooming<br /><small>Groom record no. 001</small></span></div>
              <dl>
                <div><dt>Client</dt><dd>Our fluffy cover star</dd></div>
                <div><dt>Service</dt><dd>Bath & full haircut</dd></div>
                <div><dt>Coat goal</dt><dd>Soft, rounded & tidy</dd></div>
                <div><dt>Comfort plan</dt><dd>Slow introductions + gentle breaks</dd></div>
                <div><dt>Groomer note</dt><dd>Patient, sweet, and camera ready</dd></div>
              </dl>
              <div className="receipt-total"><span>Final result</span><strong>100% FlawLyss</strong></div>
              <a href="/fur-gallery">See more transformations <ArrowRight /></a>
            </Reveal>
          </div>
        </section>

        <section className="studio-story" id="studio">
          <div className="studio-collage">
            <Reveal className="studio-photo studio-photo-main">
              <img src={homepageMedia['studio-main'].src} alt="Alyssa carefully grooming a fluffy white dog" loading="lazy" />
            </Reveal>
            <Reveal className="studio-photo studio-photo-secondary" delay={0.12}>
              <img src={homepageMedia['studio-secondary'].src} alt="Alyssa with a happy golden retriever" loading="lazy" />
            </Reveal>
            <span className="studio-tape tape-one" aria-hidden="true" />
            <span className="studio-tape tape-two" aria-hidden="true" />
            <div className="studio-stamp"><Heart fill="currentColor" /> Alyssa approved</div>
          </div>
          <Reveal className="studio-copy">
            <p className="eyebrow">Inside Alyssa’s studio</p>
            <h2>Patient hands.<br /><em>A sharp eye.</em></h2>
            <p className="studio-lead">“I want every pet to feel understood before I ever pick up the clippers.”</p>
            <p>That means reading body language, taking breaks when needed, and never rushing the details. The result is a groom that respects both comfort and character.</p>
            <div className="studio-principles">
              <span><Heart /> Comfort-led handling</span>
              <span><ShieldCheck /> Clean, focused space</span>
              <span><Scissors /> Detail-driven finish</span>
            </div>
            <a className="button button-dark" href="#booking">Plan your pet’s visit <ArrowRight /></a>
          </Reveal>
        </section>

        <section className="service-studio" id="services" style={{ '--service-pattern': `url("${homepageMedia['brand-pattern'].src}")` }}>
          <div className="service-studio-heading">
            <Reveal>
              <p className="eyebrow">The grooming menu</p>
              <h2>Choose the kind of<br /><em>fresh</em> they need.</h2>
            </Reveal>
            <p>Every service starts with a conversation. Select an option to see the intended finish and who it suits best.</p>
          </div>
          <div className="service-studio-layout">
            <div className="service-selector" role="tablist" aria-label="Grooming services">
              {services.map(({ icon: Icon, title, type }, index) => (
                <button
                  className={activeService === index ? 'is-active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={activeService === index}
                  onClick={() => setActiveService(index)}
                  key={title}
                >
                  <span><Icon /></span>
                  <div><small>{type}</small><strong>{title}</strong></div>
                  <ArrowRight />
                </button>
              ))}
            </div>
            <article className="service-feature" role="tabpanel">
              <div className="service-feature-image">
                <img src={homepageMedia[selectedService.mediaSlot].src} alt="" />
                <span>{String(activeService + 1).padStart(2, '0')}</span>
              </div>
              <div className="service-feature-copy">
                <p className="eyebrow">{selectedService.type}</p>
                <h3>{selectedService.title}</h3>
                <p>{selectedService.description}</p>
                <dl>
                  <div><dt>The finish</dt><dd>{selectedService.finish}</dd></div>
                  <div><dt>Best for</dt><dd>{selectedService.bestFor}</dd></div>
                  <div><dt>Pricing</dt><dd>Personalized to your pet</dd></div>
                </dl>
                <a className="button button-primary" href="#booking">Request this service <ArrowRight /></a>
              </div>
            </article>
          </div>
          <div className="service-includes"><Sparkles /><span><strong>Grooming packages include</strong> nail trim, ear cleaning, brushing, and anal gland expression when requested.</span></div>
        </section>

        <section className="gallery-editorial">
          <div className="gallery-editorial-heading">
            <div><p className="eyebrow">Fresh from the table</p><h2>The latest<br /><em>FlawLyss faces.</em></h2></div>
            <a href="/fur-gallery">Open the Fur Gallery <ArrowRight /></a>
          </div>
          <div className="gallery-filmstrip">
            {galleryPreview.map((item, index) => (
              <a className={`film-frame frame-${index + 1}`} href="/fur-gallery" key={item.id}>
                <div><img src={item.image} alt={`${item.name} grooming result`} /><span>0{index + 1}</span></div>
                <small>{item.name}</small>
                <strong>{item.title}</strong>
                <p>{item.count} photos in this collection</p>
              </a>
            ))}
          </div>
          <p className="gallery-hand-note">real coats · real personalities · personal finishes</p>
        </section>

        <section className="section booking-section" id="booking">
          <div className="booking-copy">
            <p className="eyebrow">Book an appointment</p>
            <h2>Ready for a fresh start?</h2>
            <p>
              Send an appointment request and Alyssa will confirm availability
              with you directly. Please allow up to one business day for a reply.
            </p>
            <div className="booking-perks">
              <span><Check /> Choose your preferred date</span>
              <span><Check /> Tell us about your pet</span>
              <span><Check /> Receive personal confirmation</span>
            </div>
            <div className="hours-card">
              <Clock3 />
              <div><strong>By appointment</strong><span>Availability confirmed after request</span></div>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <span>Appointment request</span>
              <p>Fields marked * are required</p>
            </div>
            <div className="form-grid">
              <label>Full name *<input name="name" required autoComplete="name" placeholder="Your name" /></label>
              <label>Phone number *<input name="phone" required type="tel" autoComplete="tel" placeholder="(905) 000-0000" /></label>
              <label>Email address *<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" /></label>
              <label>Pet's name *<input name="petName" required placeholder="Your pet's name" /></label>
              <label>Animal *
                <select
                  name="animal"
                  required
                  value={selectedAnimal}
                  onChange={(event) => setSelectedAnimal(event.target.value)}
                >
                  <option value="" disabled>Select one</option>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bunny</option>
                  <option>Bird</option>
                  <option>Other</option>
                </select>
              </label>
              <label>Service *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service.title}>{service.title}</option>)}</select></label>
              {selectedAnimal === 'Other' && (
                <label className="form-full-width">
                  What kind of pet do you have? *
                  <input
                    name="otherAnimal"
                    required
                    placeholder="Tell us which animal you would like to request"
                  />
                  <span className="field-help">Alyssa will confirm whether this animal can be accommodated.</span>
                </label>
              )}
              <label>Preferred date *<input name="date" required type="date" /></label>
              <label>Preferred time *<select name="time" required defaultValue=""><option value="" disabled>Select a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
            </div>

            <fieldset>
              <legend>Has your pet had surgery or medical care within the past month? *</legend>
              <label className="radio"><input type="radio" name="recentCare" value="yes" required /> Yes</label>
              <label className="radio"><input type="radio" name="recentCare" value="no" required /> No</label>
            </fieldset>
            <fieldset>
              <legend>Does your pet have any allergies or medical conditions? *</legend>
              <label className="radio"><input type="radio" name="conditions" value="yes" required /> Yes</label>
              <label className="radio"><input type="radio" name="conditions" value="no" required /> No</label>
            </fieldset>
            <label>Special instructions<textarea name="notes" rows="4" placeholder="Temperament, allergies, medical details, preferred style, or anything else we should know..." /></label>
            <button className="button button-primary submit-button" type="submit">Send appointment request <ArrowRight /></button>
            {submitted && <p className="success-message" role="status"><Check /> Thanks! Your request is ready to be connected to email or a booking system.</p>}
          </form>
        </section>

        <section className="contact-section" id="contact">
          <FloatingBubblesBackground className="bubble-layer" density={11} tone="dark" />
          <div className="contact-inner">
            <div>
              <p className="eyebrow">Contact us</p>
              <h2>Let's get your pet looking <em>FlawLyss.</em></h2>
            </div>
            <div className="contact-links">
              <a href="tel:+19059039584"><Phone /><span><small>Call or text</small>905-903-9584</span><ArrowRight /></a>
              <a href="mailto:flawlyssgrooming@gmail.com"><Mail /><span><small>Email</small>flawlyssgrooming@gmail.com</span><ArrowRight /></a>
              <a href="https://instagram.com/flawlyssgrooming" target="_blank" rel="noreferrer"><Instagram /><span><small>Instagram</small>@flawlyssgrooming</span><ArrowRight /></a>
            </div>
          </div>
        </section>
      </main>
      )}

      <footer className="footer">
        <a className="footer-brand" href="/"><img src={homepageMedia.logo.src} alt="" /> FlawLyss Grooming</a>
        <p>Where every pet leaves flawless.</p>
        <div className="footer-end">
          <p>© 2026 FlawLyss Grooming. All rights reserved.</p>
          <a className="footer-admin-link" href="/admin"><LockKeyhole /> Admin</a>
        </div>
      </footer>

      {!isFurGalleryPage && (
        <a className="floating-booking" href="/#booking">
          <CalendarDays />
          <span>Book</span>
        </a>
      )}
    </div>
  )
}

export default App
