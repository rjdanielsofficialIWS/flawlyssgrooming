import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  PawPrint,
  Phone,
  Plus,
  Search,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react'
import {
  addGalleryImages,
  compressImage,
  deleteBookingRequest,
  deleteGalleryImage,
  galleryCategories,
  getBookingRequests,
  getGalleryState,
  getHomepageMedia,
  loadBookingRequests,
  loadGalleryState,
  loadHomepageMedia,
  homepageMediaSlots,
  restoreGalleryDefaults,
  restoreHomepageMedia,
  readVideoFile,
  endAdminSession,
  isAdminSessionActive,
  setAdminPasscode,
  setHomepageMedia,
  startAdminSession,
  subscribeToCrmUpdates,
  updateBookingRequest,
  updateGalleryImageDetails,
  updateGallerySecondImage,
  verifyAdminPasscode,
} from '@/lib/crmStore'

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'booked', label: 'Booked' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDate(value, options = {}) {
  if (!value) return 'Not provided'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(date)
}

export default function AdminDashboard({ onNavigate }) {
  const [authenticated, setAuthenticated] = useState(() => isAdminSessionActive())
  const [loginPasscode, setLoginPasscode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeView, setActiveView] = useState('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [requests, setRequests] = useState(() => getBookingRequests())
  const [gallery, setGallery] = useState(() => getGalleryState())
  const [homepageMedia, setHomepageMediaState] = useState(() => getHomepageMedia())
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [uploadingCategory, setUploadingCategory] = useState('')
  const [uploadingSecondImageId, setUploadingSecondImageId] = useState('')
  const [uploadingMediaSlot, setUploadingMediaSlot] = useState('')
  const [notice, setNotice] = useState('')
  const [currentPasscode, setCurrentPasscode] = useState('')
  const [newPasscode, setNewPasscode] = useState('')
  const [confirmPasscode, setConfirmPasscode] = useState('')
  const [securityMessage, setSecurityMessage] = useState('')

  useEffect(() => subscribeToCrmUpdates(() => {
    setRequests(getBookingRequests())
    setGallery(getGalleryState())
    setHomepageMediaState(getHomepageMedia())
  }), [])

  useEffect(() => {
    let cancelled = false
    Promise.all([loadBookingRequests(), loadGalleryState(), loadHomepageMedia()])
      .then(([nextRequests, nextGallery, nextHomepageMedia]) => {
        if (cancelled) return
        setRequests(nextRequests)
        setGallery(nextGallery)
        setHomepageMediaState(nextHomepageMedia)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase()
    return requests.filter((request) => {
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      const matchesSearch = !query || [
        request.name,
        request.petName,
        request.email,
        request.phone,
        request.service,
      ].some((value) => String(value || '').toLowerCase().includes(query))
      return matchesStatus && matchesSearch
    })
  }, [requests, search, statusFilter])

  const selectedRequest = requests.find((request) => request.id === selectedRequestId)
  const newRequests = requests.filter((request) => request.status === 'new').length
  const bookedRequests = requests.filter((request) => request.status === 'booked').length
  const totalImages = Object.values(gallery).reduce((total, images) => total + images.length, 0)

  const navigate = (view) => {
    setActiveView(view)
    setMobileNavOpen(false)
  }

  const handleUpload = async (categoryId, files) => {
    if (!files.length) return
    setUploadingCategory(categoryId)
    setNotice('')

    try {
      const images = await Promise.all(Array.from(files).map(compressImage))
      const nextGallery = await addGalleryImages(categoryId, images)
      setGallery(nextGallery)
      setNotice(`${images.length} image${images.length === 1 ? '' : 's'} added to the gallery.`)
    } catch (error) {
      setNotice(error.message || 'The images could not be uploaded.')
    } finally {
      setUploadingCategory('')
    }
  }

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Delete this appointment request permanently?')) return
    const nextRequests = await deleteBookingRequest(id)
    setRequests(nextRequests)
    setSelectedRequestId(null)
  }

  const handleGalleryDetailsSave = async (categoryId, imageId, updates) => {
    try {
      const nextGallery = await updateGalleryImageDetails(categoryId, imageId, updates)
      setGallery(nextGallery)
      setNotice('Photo details saved.')
    } catch (error) {
      setNotice(error.message || 'The photo details could not be saved.')
    }
  }

  const handleSecondImageUpload = async (categoryId, imageId, files) => {
    if (!files.length) return
    setUploadingSecondImageId(imageId)
    setNotice('')

    try {
      const image = await compressImage(files[0])
      const nextGallery = await updateGallerySecondImage(categoryId, imageId, image)
      setGallery(nextGallery)
      setNotice('Second photo saved.')
    } catch (error) {
      setNotice(error.message || 'The second photo could not be saved.')
    } finally {
      setUploadingSecondImageId('')
    }
  }

  const handleHomepageMediaUpload = async (slotId, files) => {
    if (!files.length) return
    setUploadingMediaSlot(slotId)
    setNotice('')

    try {
      const slot = homepageMediaSlots.find((item) => item.id === slotId)
      const media = slot?.type === 'video' ? await readVideoFile(files[0]) : await compressImage(files[0])
      const nextHomepageMedia = await setHomepageMedia(slotId, media)
      setHomepageMediaState(nextHomepageMedia)
      setNotice(`Homepage ${slot?.type === 'video' ? 'video' : 'image'} updated successfully.`)
    } catch (error) {
      setNotice(error.message || 'The image could not be uploaded.')
    } finally {
      setUploadingMediaSlot('')
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()
    if (!verifyAdminPasscode(loginPasscode)) {
      setLoginError('That passcode is incorrect.')
      return
    }
    startAdminSession()
    setAuthenticated(true)
    setLoginPasscode('')
    setLoginError('')
  }

  const handlePasscodeChange = (event) => {
    event.preventDefault()
    setSecurityMessage('')

    if (!verifyAdminPasscode(currentPasscode)) {
      setSecurityMessage('The current passcode is incorrect.')
      return
    }
    if (newPasscode.length < 8) {
      setSecurityMessage('The new passcode must be at least 8 characters.')
      return
    }
    if (newPasscode !== confirmPasscode) {
      setSecurityMessage('The new passcodes do not match.')
      return
    }

    setAdminPasscode(newPasscode)
    setCurrentPasscode('')
    setNewPasscode('')
    setConfirmPasscode('')
    setSecurityMessage('Passcode updated successfully.')
  }

  const handleLogout = () => {
    endAdminSession()
    setAuthenticated(false)
    setActiveView('overview')
  }

  if (!authenticated) {
    return (
      <main className="admin-login-page">
        <a className="admin-login-back" href="/">← Back to website</a>
        <form className="admin-login-card" onSubmit={handleLogin}>
          <img src="/logo.jpeg" alt="" />
          <p className="admin-kicker">FlawLyss Grooming</p>
          <h1>Admin access</h1>
          <p>Enter the admin passcode to open the CRM dashboard.</p>
          <label>
            Passcode
            <div className="admin-password-field"><LockKeyhole /><input type="password" value={loginPasscode} onChange={(event) => setLoginPasscode(event.target.value)} autoComplete="current-password" autoFocus required /></div>
          </label>
          {loginError && <p className="admin-login-error" role="alert">{loginError}</p>}
          <button type="submit">Open dashboard</button>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <aside className={mobileNavOpen ? 'admin-sidebar is-open' : 'admin-sidebar'}>
        <div className="admin-brand">
          <img src="/logo.jpeg" alt="" />
          <div><strong>FlawLyss</strong><span>Admin CRM</span></div>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <button className={activeView === 'overview' ? 'is-active' : ''} onClick={() => navigate('overview')}>
            <LayoutDashboard /> Overview
          </button>
          <button className={activeView === 'requests' ? 'is-active' : ''} onClick={() => navigate('requests')}>
            <Inbox /> Requests {newRequests > 0 && <span>{newRequests}</span>}
          </button>
          <button className={activeView === 'gallery' ? 'is-active' : ''} onClick={() => navigate('gallery')}>
            <Images /> Fur Gallery
          </button>
          <button className={activeView === 'homepage-media' ? 'is-active' : ''} onClick={() => navigate('homepage-media')}>
            <Images /> Homepage Media
          </button>
          <button className={activeView === 'security' ? 'is-active' : ''} onClick={() => navigate('security')}>
            <LockKeyhole /> Security
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" onClick={onNavigate?.('/')}><ExternalLink /> View website</a>
          <p>Browser-persisted CRM</p>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle admin navigation">
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
          <div>
            <p>{formatDate(new Date().toISOString(), { weekday: 'long' })}</p>
            <strong>Welcome back, Alyssa</strong>
          </div>
          <div className="admin-profile"><span>A</span><div><strong>Alyssa</strong><small>Administrator</small></div></div>
        </header>

        <div className="admin-content">
          {activeView === 'overview' && (
            <>
              <div className="admin-page-heading">
                <div><p className="admin-kicker">Dashboard</p><h1>Business overview</h1><span>Your appointments and gallery at a glance.</span></div>
                <button className="admin-primary-action" onClick={() => navigate('gallery')}><Plus /> Add gallery photos</button>
              </div>

              <section className="admin-stats" aria-label="CRM summary">
                <article><span className="admin-stat-icon pink"><Inbox /></span><div><small>Total requests</small><strong>{requests.length}</strong><p>{newRequests} waiting for review</p></div></article>
                <article><span className="admin-stat-icon purple"><CalendarDays /></span><div><small>Booked</small><strong>{bookedRequests}</strong><p>Confirmed appointments</p></div></article>
                <article><span className="admin-stat-icon gold"><Images /></span><div><small>Gallery photos</small><strong>{totalImages}</strong><p>Published in the Fur Gallery</p></div></article>
              </section>

              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel-heading"><div><h2>Recent requests</h2><p>Latest appointment activity</p></div><button onClick={() => navigate('requests')}>View all <ChevronRight /></button></div>
                  <RequestTable requests={requests.slice(0, 5)} onSelect={(id) => { setSelectedRequestId(id); navigate('requests') }} />
                </section>
                <section className="admin-panel admin-quick-panel">
                  <div className="admin-panel-heading"><div><h2>Gallery status</h2><p>Your published photo collection</p></div></div>
                  <div className="admin-category-summary">
                    {galleryCategories.map((category) => (
                      <button key={category.id} onClick={() => navigate('gallery')}>
                        <span>{(gallery[category.id] || []).length}</span>
                        <div><strong>{category.name}</strong><small>Published photos</small></div>
                        <ChevronRight />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {activeView === 'requests' && (
            <>
              <div className="admin-page-heading">
                <div><p className="admin-kicker">Client management</p><h1>Appointment requests</h1><span>Review details, update progress, and contact pet parents.</span></div>
              </div>
              <section className="admin-panel admin-requests-panel">
                <div className="admin-toolbar">
                  <label className="admin-search"><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search client, pet, or service" /></label>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter requests by status">
                    <option value="all">All statuses</option>
                    {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                  </select>
                  <span>{filteredRequests.length} request{filteredRequests.length === 1 ? '' : 's'}</span>
                </div>
                <RequestTable requests={filteredRequests} onSelect={setSelectedRequestId} />
              </section>
            </>
          )}

          {activeView === 'gallery' && (
            <>
              <div className="admin-page-heading">
                <div><p className="admin-kicker">Content manager</p><h1>Fur Gallery</h1><span>Upload photos and add the pet’s name and a separate caption.</span></div>
                <a className="admin-secondary-action" href="/fur-gallery" onClick={onNavigate?.('/fur-gallery')}><ExternalLink /> Preview gallery</a>
              </div>
              {notice && <div className="admin-notice" role="status"><Check /> {notice}</div>}
              <div className="admin-gallery-categories">
                {galleryCategories.map((category) => {
                  const images = gallery[category.id] || []
                  return (
                    <section className="admin-panel admin-gallery-panel" key={category.id}>
                      <div className="admin-panel-heading">
                        <div><p className="admin-kicker">{images.length} photos</p><h2>{category.name}</h2><p>{category.caption}</p></div>
                        <label className="admin-upload-button">
                          <Upload /> {uploadingCategory === category.id ? 'Processing...' : 'Upload photos'}
                          <input type="file" accept="image/*" multiple disabled={uploadingCategory === category.id} onChange={(event) => { handleUpload(category.id, event.target.files); event.target.value = '' }} />
                        </label>
                      </div>
                      {images.length ? (
                        <div className="admin-image-grid">
                          {images.map((image) => (
                            <article key={image.id}>
                              <div className={image.secondSrc ? 'admin-gallery-photo-pair' : 'admin-gallery-photo-pair is-single'}>
                                <img src={image.src} alt={image.petName || image.caption || ''} />
                                {image.secondSrc && <img src={image.secondSrc} alt="" />}
                              </div>
                              <div className="admin-gallery-fields">
                                <div className="admin-second-photo-actions">
                                  <label className="admin-second-photo-button">
                                    <Upload /> {uploadingSecondImageId === image.id ? 'Processing...' : image.secondSrc ? 'Replace second photo' : 'Add second photo'}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      disabled={uploadingSecondImageId === image.id}
                                      onChange={(event) => {
                                        handleSecondImageUpload(category.id, image.id, event.target.files)
                                        event.target.value = ''
                                      }}
                                    />
                                  </label>
                                  {image.secondSrc && (
                                    <button
                                      className="admin-remove-second-photo"
                                      type="button"
                                      onClick={async () => {
                                        const nextGallery = await updateGallerySecondImage(category.id, image.id, null)
                                        setGallery(nextGallery)
                                      }}
                                    >
                                      Remove second
                                    </button>
                                  )}
                                </div>
                                <label>
                                  Pet’s name
                                  <input
                                    type="text"
                                    defaultValue={image.petName}
                                    placeholder="e.g. Bella"
                                    maxLength="50"
                                    onBlur={(event) => {
                                      if (event.target.value.trim() !== image.petName) {
                                        handleGalleryDetailsSave(category.id, image.id, { petName: event.target.value })
                                      }
                                    }}
                                  />
                                </label>
                                <label>
                                  Caption
                                  <textarea
                                    defaultValue={image.caption}
                                    placeholder="Add a short note about this photo"
                                    maxLength="160"
                                    rows="3"
                                    onBlur={(event) => {
                                      if (event.target.value.trim() !== image.caption) {
                                        handleGalleryDetailsSave(category.id, image.id, { caption: event.target.value })
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                              <button className="admin-delete-gallery-entry" type="button" onClick={async () => {
                                const nextGallery = await deleteGalleryImage(category.id, image.id)
                                setGallery(nextGallery)
                              }} aria-label={`Delete ${image.petName || image.caption || 'gallery photo'}`}><Trash2 /></button>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="admin-empty-state"><Images /><h3>No gallery photos yet</h3><p>Upload images or restore the starter set.</p><button onClick={async () => { const nextGallery = await restoreGalleryDefaults(category.id); setGallery(nextGallery) }}>Restore starter images</button></div>
                      )}
                    </section>
                  )
                })}
              </div>
            </>
          )}

          {activeView === 'homepage-media' && (
            <>
              <div className="admin-page-heading">
                <div><p className="admin-kicker">Content manager</p><h1>Homepage media</h1><span>Replace every image used throughout the homepage.</span></div>
                <a className="admin-secondary-action" href="/" onClick={onNavigate?.('/')}><ExternalLink /> Preview homepage</a>
              </div>
              {notice && <div className="admin-notice" role="status"><Check /> {notice}</div>}
              <section className="admin-panel admin-home-media-panel">
                <div className="admin-panel-heading">
                  <div><h2>Image placements</h2><p>Gallery preview images remain managed under Fur Gallery.</p></div>
                </div>
                <div className="admin-home-media-grid">
                  {homepageMediaSlots.map((slot) => {
                    const media = homepageMedia[slot.id]
                    return (
                      <article className="admin-media-slot" key={slot.id}>
                        <div className="admin-media-preview">
                          {slot.type === 'video'
                            ? <video src={media.src} muted loop autoPlay playsInline />
                            : <img src={media.src} alt="" />}
                        </div>
                        <div className="admin-media-copy">
                          <small>{slot.section}</small>
                          <h3>{slot.name}</h3>
                          <p>{slot.description}</p>
                        </div>
                        <div className="admin-media-actions">
                          <label className="admin-upload-button">
                            <Upload /> {uploadingMediaSlot === slot.id ? 'Processing...' : 'Replace'}
                            <input type="file" accept={slot.type === 'video' ? 'video/webm,video/mp4' : 'image/*'} disabled={uploadingMediaSlot === slot.id} onChange={(event) => { handleHomepageMediaUpload(slot.id, event.target.files); event.target.value = '' }} />
                          </label>
                          <button type="button" disabled={media.isDefault} onClick={async () => {
                            const nextHomepageMedia = await restoreHomepageMedia(slot.id)
                            setHomepageMediaState(nextHomepageMedia)
                            setNotice(`${slot.name} restored to its default image.`)
                          }}>
                            Restore default
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            </>
          )}

          {activeView === 'security' && (
            <>
              <div className="admin-page-heading">
                <div><p className="admin-kicker">Account settings</p><h1>Security</h1><span>Update the passcode used to access this dashboard.</span></div>
              </div>
              <section className="admin-panel admin-security-panel">
                <div className="admin-panel-heading"><div><h2>Change admin passcode</h2><p>Use at least 8 characters and keep it private.</p></div></div>
                <form className="admin-security-form" onSubmit={handlePasscodeChange}>
                  <label>Current passcode<input type="password" value={currentPasscode} onChange={(event) => setCurrentPasscode(event.target.value)} autoComplete="current-password" required /></label>
                  <label>New passcode<input type="password" value={newPasscode} onChange={(event) => setNewPasscode(event.target.value)} autoComplete="new-password" minLength="8" required /></label>
                  <label>Confirm new passcode<input type="password" value={confirmPasscode} onChange={(event) => setConfirmPasscode(event.target.value)} autoComplete="new-password" minLength="8" required /></label>
                  {securityMessage && <p className={securityMessage.includes('successfully') ? 'admin-security-success' : 'admin-security-error'} role="status">{securityMessage}</p>}
                  <button className="admin-primary-action" type="submit"><LockKeyhole /> Update passcode</button>
                </form>
                <div className="admin-signout-row">
                  <div><strong>End admin session</strong><p>Lock the dashboard on this browser.</p></div>
                  <button type="button" onClick={handleLogout}><LogOut /> Sign out</button>
                </div>
              </section>
            </>
          )}
        </div>
      </section>

      {selectedRequest && (
        <div className="admin-drawer-backdrop" onMouseDown={() => setSelectedRequestId(null)}>
          <aside className="admin-request-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label="Appointment request details">
            <div className="admin-drawer-header">
              <div><p className="admin-kicker">Request details</p><h2>{selectedRequest.petName || 'Pet'}’s appointment</h2></div>
              <button onClick={() => setSelectedRequestId(null)} aria-label="Close request details"><X /></button>
            </div>
            <label className="admin-status-control">Status
              <select value={selectedRequest.status} onChange={async (event) => {
                const nextRequests = await updateBookingRequest(selectedRequest.id, { status: event.target.value })
                setRequests(nextRequests)
              }}>
                {statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </label>
            <div className="admin-detail-section">
              <h3>Client</h3>
              <DetailRow icon={UserRound} label="Name" value={selectedRequest.name} />
              <DetailRow icon={Phone} label="Phone" value={selectedRequest.phone} href={`tel:${selectedRequest.phone}`} />
              <DetailRow icon={Mail} label="Email" value={selectedRequest.email} href={`mailto:${selectedRequest.email}`} />
            </div>
            <div className="admin-detail-section">
              <h3>Appointment</h3>
              <DetailRow icon={PawPrint} label="Pet" value={`${selectedRequest.petName || ''} · ${selectedRequest.animal || ''}`} />
              <DetailRow icon={CalendarDays} label="Preferred date" value={formatDate(selectedRequest.date)} />
              <DetailRow icon={Clock3} label="Preferred time" value={selectedRequest.time} />
              <DetailRow icon={Check} label="Service" value={selectedRequest.service} />
            </div>
            <div className="admin-request-notes">
              <h3>Health & notes</h3>
              <p><strong>Recent medical care:</strong> {selectedRequest.recentCare || 'Not provided'}</p>
              <p><strong>Allergies or conditions:</strong> {selectedRequest.conditions || 'Not provided'}</p>
              <p><strong>Special instructions:</strong><br />{selectedRequest.notes || 'No special instructions.'}</p>
            </div>
            <div className="admin-drawer-actions">
              <a href={`tel:${selectedRequest.phone}`}><Phone /> Call client</a>
              <button onClick={() => handleDeleteRequest(selectedRequest.id)}><Trash2 /> Delete request</button>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}

function RequestTable({ requests, onSelect }) {
  if (!requests.length) {
    return <div className="admin-empty-state"><Inbox /><h3>No appointment requests</h3><p>New website submissions will appear here automatically.</p></div>
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-request-table">
        <thead><tr><th>Client & pet</th><th>Service</th><th>Preferred date</th><th>Status</th><th aria-label="Open request" /></tr></thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} onClick={() => onSelect(request.id)}>
              <td><strong>{request.name || 'Unnamed client'}</strong><span>{request.petName || 'Pet'} · {request.animal || 'Animal not set'}</span></td>
              <td>{request.service || 'Not selected'}</td>
              <td><strong>{formatDate(request.date)}</strong><span>{request.time || 'Any time'}</span></td>
              <td><span className={`admin-status status-${request.status}`}>{statusOptions.find((item) => item.value === request.status)?.label || request.status}</span></td>
              <td><ChevronRight /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, href }) {
  const content = <><Icon /><div><small>{label}</small><strong>{value || 'Not provided'}</strong></div></>
  return href ? <a className="admin-detail-row" href={href}>{content}</a> : <div className="admin-detail-row">{content}</div>
}
