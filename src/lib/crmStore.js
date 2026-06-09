const GALLERY_KEY = 'flawlyss.gallery.v1'
const REQUESTS_KEY = 'flawlyss.requests.v1'
const HOMEPAGE_MEDIA_KEY = 'flawlyss.homepage-media.v1'
const ADMIN_PASSCODE_KEY = 'flawlyss.admin-passcode.v1'
const ADMIN_SESSION_KEY = 'flawlyss.admin-session.v1'
const CRM_EVENT = 'flawlyss:crm-update'
const DEFAULT_ADMIN_PASSCODE = 'Flawlyss2026'

export const galleryCategories = [
  {
    id: 'full-haircut',
    name: 'Bath & Full Haircut',
    title: 'Soft Rounded Finish',
    caption: 'Complete transformations, detailed shaping, and polished full-coat finishes.',
    defaultImages: [
      '/before-groom.webp',
      '/after-groom.webp',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 'bath-brush',
    name: 'Bath & Brush',
    title: 'Fresh Coat Glow',
    caption: 'Clean, soft coats and gentle brush-outs designed around comfort.',
    defaultImages: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 'bath-trim',
    name: 'Bath & Trim',
    title: 'Tidy Trim Touch',
    caption: 'Neat faces, feet, and finishing details without a complete haircut.',
    defaultImages: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=85',
      '/alyssa-working.jpeg',
    ],
  },
]

export const homepageMediaSlots = [
  { id: 'logo', name: 'Brand logo', section: 'Global branding', description: 'Header and footer logo.', defaultSrc: '/logo.jpeg' },
  { id: 'hero-banner', name: 'Hero banner', section: 'Hero', description: 'Large banner at the top of the homepage.', defaultSrc: '/hero-banner.jpeg' },
  { id: 'journal-video', name: 'Finished grooming video', section: 'Editorial introduction', description: 'Short muted finished-look video beside “A groom should feel as good as it looks.”', defaultSrc: '/grooming-placeholder.webm', type: 'video' },
  { id: 'transformation-before', name: 'Transformation before', section: 'Cover groom', description: 'Left side of the interactive before-and-after.', defaultSrc: '/before-groom.webp' },
  { id: 'transformation-after', name: 'Transformation after', section: 'Cover groom', description: 'Right side of the interactive before-and-after.', defaultSrc: '/after-groom.webp' },
  { id: 'studio-main', name: 'Alyssa grooming', section: 'Alyssa’s studio', description: 'Large scrapbook photograph.', defaultSrc: '/alyssa-working.jpeg' },
  { id: 'studio-secondary', name: 'Alyssa portrait', section: 'Alyssa’s studio', description: 'Smaller overlapping scrapbook photograph.', defaultSrc: '/groomer-and-dog.webp' },
  { id: 'service-bath-brush', name: 'Bath & Brush', section: 'Service menu', description: 'Featured image for Bath & Brush.', defaultSrc: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85' },
  { id: 'service-full-haircut', name: 'Bath & Full Haircut', section: 'Service menu', description: 'Featured image for Bath & Full Haircut.', defaultSrc: '/after-groom.webp' },
  { id: 'service-bath-trim', name: 'Bath & Trim', section: 'Service menu', description: 'Featured image for Bath & Trim.', defaultSrc: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1000&q=85' },
  { id: 'service-nail-trim', name: 'Nail Trim', section: 'Service menu', description: 'Featured image for Nail Trim.', defaultSrc: '/groomer-and-dog.webp' },
  { id: 'service-nail-grind', name: 'Nail Grind', section: 'Service menu', description: 'Featured image for Nail Grind.', defaultSrc: '/groomer-and-dog.webp' },
  { id: 'service-teeth', name: 'Teeth Brushing', section: 'Service menu', description: 'Featured image for Teeth Brushing.', defaultSrc: '/alyssa-working.jpeg' },
  { id: 'service-ears', name: 'Ear Cleaning / Plucking', section: 'Service menu', description: 'Featured image for Ear Cleaning / Plucking.', defaultSrc: '/alyssa-working.jpeg' },
  { id: 'brand-pattern', name: 'Background pattern', section: 'Service menu', description: 'Subtle branded pattern behind the service selector.', defaultSrc: '/flawlyss-pattern.png' },
]

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function read(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent(CRM_EVENT, { detail: { key } }))
}

function defaultGalleryState() {
  return Object.fromEntries(
    galleryCategories.map((category) => [
      category.id,
      category.defaultImages.map((src, index) => ({
        id: `${category.id}-default-${index}`,
        src,
        name: `Gallery image ${index + 1}`,
        isDefault: true,
      })),
    ]),
  )
}

export function getGalleryState() {
  return read(GALLERY_KEY, defaultGalleryState())
}

function defaultHomepageMedia() {
  return Object.fromEntries(homepageMediaSlots.map((slot) => [slot.id, {
    src: slot.defaultSrc,
    name: slot.name,
    isDefault: true,
  }]))
}

export function getHomepageMedia() {
  return { ...defaultHomepageMedia(), ...read(HOMEPAGE_MEDIA_KEY, {}) }
}

export function setHomepageMedia(slotId, image) {
  const media = getHomepageMedia()
  media[slotId] = { ...image, isDefault: false }
  write(HOMEPAGE_MEDIA_KEY, media)
  return media
}

export function restoreHomepageMedia(slotId) {
  const media = getHomepageMedia()
  const slot = homepageMediaSlots.find((item) => item.id === slotId)
  if (!slot) return media
  media[slotId] = { src: slot.defaultSrc, name: slot.name, isDefault: true }
  write(HOMEPAGE_MEDIA_KEY, media)
  return media
}

export function addGalleryImages(categoryId, images) {
  const state = getGalleryState()
  state[categoryId] = [...(state[categoryId] || []), ...images]
  write(GALLERY_KEY, state)
  return state
}

export function deleteGalleryImage(categoryId, imageId) {
  const state = getGalleryState()
  state[categoryId] = (state[categoryId] || []).filter((image) => image.id !== imageId)
  write(GALLERY_KEY, state)
  return state
}

export function restoreGalleryDefaults(categoryId) {
  const state = getGalleryState()
  const category = galleryCategories.find((item) => item.id === categoryId)
  if (!category) return state

  state[categoryId] = category.defaultImages.map((src, index) => ({
    id: `${category.id}-default-${index}`,
    src,
    name: `Gallery image ${index + 1}`,
    isDefault: true,
  }))
  write(GALLERY_KEY, state)
  return state
}

export function getBookingRequests() {
  return read(REQUESTS_KEY, [])
}

export function saveBookingRequest(request) {
  const requests = getBookingRequests()
  const savedRequest = {
    id: createId('request'),
    status: 'new',
    createdAt: new Date().toISOString(),
    ...request,
  }
  write(REQUESTS_KEY, [savedRequest, ...requests])
  return savedRequest
}

export function updateBookingRequest(id, updates) {
  const requests = getBookingRequests().map((request) =>
    request.id === id ? { ...request, ...updates } : request,
  )
  write(REQUESTS_KEY, requests)
  return requests
}

export function deleteBookingRequest(id) {
  const requests = getBookingRequests().filter((request) => request.id !== id)
  write(REQUESTS_KEY, requests)
  return requests
}

export function subscribeToCrmUpdates(callback) {
  const handleCustomEvent = () => callback()
  const handleStorage = (event) => {
    if (event.key === GALLERY_KEY || event.key === REQUESTS_KEY || event.key === HOMEPAGE_MEDIA_KEY) callback()
  }

  window.addEventListener(CRM_EVENT, handleCustomEvent)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(CRM_EVENT, handleCustomEvent)
    window.removeEventListener('storage', handleStorage)
  }
}

export function verifyAdminPasscode(passcode) {
  return passcode === window.localStorage.getItem(ADMIN_PASSCODE_KEY) || (
    !window.localStorage.getItem(ADMIN_PASSCODE_KEY) && passcode === DEFAULT_ADMIN_PASSCODE
  )
}

export function setAdminPasscode(passcode) {
  window.localStorage.setItem(ADMIN_PASSCODE_KEY, passcode)
}

export function isAdminSessionActive() {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated'
}

export function startAdminSession() {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated')
}

export function endAdminSession() {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`${file.name} is not an image.`))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error(`Could not process ${file.name}.`))
      image.onload = () => {
        const maxDimension = 1400
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        resolve({
          id: createId('image'),
          src: canvas.toDataURL('image/jpeg', 0.78),
          name: file.name,
          isDefault: false,
        })
      }
      image.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function readVideoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('video/')) {
      reject(new Error(`${file.name} is not a video.`))
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error('Please use a video smaller than 4 MB for browser storage.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
    reader.onload = () => resolve({
      id: createId('video'),
      src: reader.result,
      name: file.name,
      isDefault: false,
    })
    reader.readAsDataURL(file)
  })
}
