const GALLERY_KEY = 'flawlyss.gallery.v1'
const REQUESTS_KEY = 'flawlyss.requests.v1'
const HOMEPAGE_MEDIA_KEY = 'flawlyss.homepage-media.v1'
const ADMIN_PASSCODE_KEY = 'flawlyss.admin-passcode.v1'
const ADMIN_SESSION_KEY = 'flawlyss.admin-session.v1'
const CRM_EVENT = 'flawlyss:crm-update'
const DEFAULT_ADMIN_PASSCODE = 'Flawlyss2026'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://azxeswwbfojiuovezfik.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6eGVzd3diZm9qaXVvdmV6ZmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMzUxNjMsImV4cCI6MjA5NjYxMTE2M30.dSb59_u6VqY6wbmDJ6KJsR5hIuONRXvgddjsCIoVfCs'
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
const SUPABASE_REST = `${SUPABASE_URL}/rest/v1`

export const galleryCategories = [
  {
    id: 'gallery',
    name: 'Fur Gallery',
    title: 'Recent FlawLyss Faces',
    caption: 'A simple collection of pets and their finished looks.',
    defaultImages: [
      '/before-groom.webp',
      '/after-groom.webp',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=900&q=85',
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

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    ...extra,
  }
}

async function supabaseRequest(path, options = {}) {
  if (!SUPABASE_ENABLED) throw new Error('Supabase is not configured.')

  const response = await fetch(`${SUPABASE_REST}${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...supabaseHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    throw new Error(message || 'Supabase request failed.')
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

function normalizeGalleryRows(rows) {
  const gallery = { gallery: [] }

  if (!rows.length) return defaultGalleryState()

  rows
    .slice()
    .sort((a, b) => {
      const orderA = a.sort_order ?? 0
      const orderB = b.sort_order ?? 0
      if (orderA !== orderB) return orderA - orderB
      return String(a.created_at || '').localeCompare(String(b.created_at || ''))
    })
    .forEach((row) => {
      gallery.gallery.push({
        id: row.id,
        src: row.src,
        name: row.name,
        isDefault: Boolean(row.is_default),
      })
    })

  return Object.fromEntries(
    galleryCategories.map((category) => [
      category.id,
      gallery[category.id]?.length ? gallery[category.id] : category.defaultImages.map((src, index) => ({
        id: `${category.id}-default-${index}`,
        src,
        name: `Gallery image ${index + 1}`,
        isDefault: true,
      })),
    ]),
  )
}

function normalizeHomepageMediaRows(rows) {
  const media = defaultHomepageMedia()
  rows.forEach((row) => {
    media[row.slot_id] = {
      src: row.src,
      name: row.name,
      isDefault: Boolean(row.is_default),
    }
  })
  return media
}

function normalizeBookingRows(rows) {
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email,
    petName: row.pet_name,
    animal: row.animal,
    otherAnimal: row.other_animal,
    service: row.service,
    date: row.date,
    time: row.time,
    recentCare: row.recent_care,
    conditions: row.conditions,
    notes: row.notes,
  }))
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
  const stored = read(GALLERY_KEY, null)
  if (!stored) return defaultGalleryState()
  if (Array.isArray(stored.gallery)) return stored

  return {
    gallery: Object.values(stored).flatMap((images) => Array.isArray(images) ? images : []),
  }
}

export async function loadGalleryState() {
  if (!SUPABASE_ENABLED) return getGalleryState()
  const rows = await supabaseRequest('/gallery_images?select=*', {
    headers: supabaseHeaders(),
  })
  const state = normalizeGalleryRows(rows || [])
  write(GALLERY_KEY, state)
  return state
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

export async function loadHomepageMedia() {
  if (!SUPABASE_ENABLED) return getHomepageMedia()
  const rows = await supabaseRequest('/homepage_media?select=*', {
    headers: supabaseHeaders(),
  })
  const media = normalizeHomepageMediaRows(rows || [])
  write(HOMEPAGE_MEDIA_KEY, media)
  return media
}

export async function setHomepageMedia(slotId, image) {
  const media = getHomepageMedia()
  media[slotId] = { ...image, isDefault: false }

  if (SUPABASE_ENABLED) {
    await supabaseRequest('/homepage_media?on_conflict=slot_id', {
      method: 'POST',
      headers: supabaseHeaders({ Prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify([{
        slot_id: slotId,
        name: image.name,
        src: image.src,
        is_default: false,
      }]),
    })
  }

  write(HOMEPAGE_MEDIA_KEY, media)
  return media
}

export async function restoreHomepageMedia(slotId) {
  const media = getHomepageMedia()
  const slot = homepageMediaSlots.find((item) => item.id === slotId)
  if (!slot) return media
  media[slotId] = { src: slot.defaultSrc, name: slot.name, isDefault: true }

  if (SUPABASE_ENABLED) {
    await supabaseRequest('/homepage_media?slot_id=eq.' + encodeURIComponent(slotId), {
      method: 'DELETE',
      headers: supabaseHeaders(),
    })
    await supabaseRequest('/homepage_media?on_conflict=slot_id', {
      method: 'POST',
      headers: supabaseHeaders({ Prefer: 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify([{
        slot_id: slotId,
        name: slot.name,
        src: slot.defaultSrc,
        is_default: true,
      }]),
    })
  }

  write(HOMEPAGE_MEDIA_KEY, media)
  return media
}

export async function addGalleryImages(categoryId, images) {
  const state = getGalleryState()
  const existingCount = (state[categoryId] || []).length
  const rows = images.map((image, index) => ({
    id: image.id,
    category_id: categoryId,
    name: image.name,
    src: image.src,
    is_default: false,
    sort_order: existingCount + index + 1,
  }))
  state[categoryId] = [...(state[categoryId] || []), ...images]

  if (SUPABASE_ENABLED) {
    await supabaseRequest('/gallery_images', {
      method: 'POST',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(rows),
    })
  }

  write(GALLERY_KEY, state)
  return state
}

export async function deleteGalleryImage(categoryId, imageId) {
  const state = getGalleryState()
  state[categoryId] = (state[categoryId] || []).filter((image) => image.id !== imageId)

  if (SUPABASE_ENABLED) {
    await supabaseRequest(`/gallery_images?id=eq.${encodeURIComponent(imageId)}`, {
      method: 'DELETE',
      headers: supabaseHeaders(),
    })
  }

  write(GALLERY_KEY, state)
  return state
}

export async function updateGalleryImageCaption(categoryId, imageId, caption) {
  const state = getGalleryState()
  const image = (state[categoryId] || []).find((item) => item.id === imageId)
  if (!image) return state

  image.name = caption.trim()

  if (SUPABASE_ENABLED) {
    await supabaseRequest(`/gallery_images?id=eq.${encodeURIComponent(imageId)}`, {
      method: 'PATCH',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify({ name: image.name }),
    })
  }

  write(GALLERY_KEY, state)
  return state
}

export async function restoreGalleryDefaults(categoryId) {
  const state = getGalleryState()
  const category = galleryCategories.find((item) => item.id === categoryId)
  if (!category) return state

  const defaults = category.defaultImages.map((src, index) => ({
    id: `${category.id}-default-${index}`,
    category_id: category.id,
    src,
    name: `Gallery image ${index + 1}`,
    is_default: true,
    sort_order: index,
  }))
  state[categoryId] = defaults.map((image) => ({
    id: image.id,
    src: image.src,
    name: image.name,
    isDefault: true,
  }))

  if (SUPABASE_ENABLED) {
    await supabaseRequest('/gallery_images?id=not.is.null', {
      method: 'DELETE',
      headers: supabaseHeaders(),
    })
    await supabaseRequest('/gallery_images', {
      method: 'POST',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(defaults),
    })
  }

  write(GALLERY_KEY, state)
  return state
}

export function getBookingRequests() {
  return read(REQUESTS_KEY, [])
}

export async function loadBookingRequests() {
  if (!SUPABASE_ENABLED) return getBookingRequests()
  const rows = await supabaseRequest('/booking_requests?select=*&order=created_at.desc', {
    headers: supabaseHeaders(),
  })
  const requests = normalizeBookingRows(rows || [])
  write(REQUESTS_KEY, requests)
  return requests
}

export async function saveBookingRequest(request) {
  const requests = getBookingRequests()
  const savedRequest = {
    id: createId('request'),
    status: 'new',
    createdAt: new Date().toISOString(),
    ...request,
  }

  if (SUPABASE_ENABLED) {
    await supabaseRequest('/booking_requests', {
      method: 'POST',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify([{
        id: savedRequest.id,
        status: savedRequest.status,
        created_at: savedRequest.createdAt,
        name: savedRequest.name,
        phone: savedRequest.phone,
        email: savedRequest.email,
        pet_name: savedRequest.petName,
        animal: savedRequest.animal,
        other_animal: savedRequest.otherAnimal || null,
        service: savedRequest.service,
        date: savedRequest.date,
        time: savedRequest.time,
        recent_care: savedRequest.recentCare,
        conditions: savedRequest.conditions,
        notes: savedRequest.notes || null,
      }]),
    })
  }

  write(REQUESTS_KEY, [savedRequest, ...requests])
  return savedRequest
}

export async function updateBookingRequest(id, updates) {
  const requests = getBookingRequests().map((request) =>
    request.id === id ? { ...request, ...updates } : request,
  )

  if (SUPABASE_ENABLED) {
    await supabaseRequest(`/booking_requests?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify({
        status: updates.status,
      }),
    })
  }

  write(REQUESTS_KEY, requests)
  return requests
}

export async function deleteBookingRequest(id) {
  const requests = getBookingRequests().filter((request) => request.id !== id)

  if (SUPABASE_ENABLED) {
    await supabaseRequest(`/booking_requests?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: supabaseHeaders(),
    })
  }

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
