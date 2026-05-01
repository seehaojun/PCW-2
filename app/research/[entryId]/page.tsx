'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { StatusBadge } from '@/components/StatusBadge'
import { VoiceRecorder } from '@/components/VoiceRecorder'
import { PhotoUploader } from '@/components/PhotoUploader'
import { PhotoLightbox } from '@/components/PhotoLightbox'
import { OfflineBanner } from '@/components/OfflineBanner'
import { buildMapsUrl } from '@/lib/maps'

interface Reading {
  title: string
  source: string
  url: string
}

interface Entry {
  id: string
  site_name: string
  site_city: string
  site_country: string
  lat: number | null
  lng: number | null
  date: string
  city: string
  status: string
  text_notes: string | null
  description: string | null
  voice_clip_urls: string[]
  photo_urls: string[]
  readings: Reading[]
  published_at: string | null
}

export default function ResearchEntryPage() {
  const { entryId } = useParams<{ entryId: string }>()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [newReading, setNewReading] = useState({ title: '', source: '', url: '' })
  const saveTimerRef = useRef<NodeJS.Timeout>(null)

  const fetchEntry = useCallback(async () => {
    const res = await fetch(`/api/research/${entryId}`)
    if (res.ok) {
      const data = await res.json()
      data.readings = typeof data.readings === 'string' ? JSON.parse(data.readings) : (data.readings ?? [])
      data.voice_clip_urls = data.voice_clip_urls ?? []
      data.photo_urls = data.photo_urls ?? []
      setEntry(data)
    }
    setLoading(false)
  }, [entryId])

  useEffect(() => {
    fetchEntry()
  }, [fetchEntry])

  async function patch(body: Partial<Entry>) {
    setSaving(true)
    const res = await fetch(`/api/research/${entryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const data = await res.json()
      data.readings = typeof data.readings === 'string' ? JSON.parse(data.readings) : (data.readings ?? [])
      data.voice_clip_urls = data.voice_clip_urls ?? []
      data.photo_urls = data.photo_urls ?? []
      setEntry(data)
    }
    setSaving(false)
  }

  function handleNotesChange(value: string) {
    setEntry((prev) => prev ? { ...prev, text_notes: value } : prev)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => patch({ text_notes: value } as Partial<Entry>), 1000)
  }

  function handleDescriptionChange(value: string) {
    setEntry((prev) => prev ? { ...prev, description: value } : prev)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => patch({ description: value } as Partial<Entry>), 1000)
  }

  function addReading() {
    if (!newReading.title) return
    const updated = [...(entry?.readings ?? []), { ...newReading }]
    patch({ readings: updated } as unknown as Partial<Entry>)
    setNewReading({ title: '', source: '', url: '' })
  }

  function removeReading(index: number) {
    const updated = [...(entry?.readings ?? [])]
    updated.splice(index, 1)
    patch({ readings: updated } as unknown as Partial<Entry>)
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-text-secondary">Loading...</div>
      </>
    )
  }

  if (!entry) {
    return (
      <>
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-text-secondary">Entry not found.</div>
      </>
    )
  }

  const canCurate = entry.status === 'draft' && !!entry.text_notes?.trim()
  const canPublish = entry.status === 'curated' && !!entry.description?.trim()

  return (
    <>
      <NavBar />
      <OfflineBanner />
      {lightboxUrl && <PhotoLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}

      <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6 pb-28">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{entry.site_name}</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {entry.site_city}, {entry.site_country} &middot;{' '}
            {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={entry.status} />
            {entry.lat && entry.lng && (
              <a
                href={buildMapsUrl(entry.lat, entry.lng)}
                target="_blank" rel="noopener noreferrer"
                className="text-sm text-accent hover:underline"
              >
                Open in Maps &rarr;
              </a>
            )}
          </div>
        </div>

        {/* Text Notes */}
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Text Notes</p>
          <textarea
            value={entry.text_notes ?? ''}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Field notes, observations, thoughts..."
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text-primary resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <p className="text-xs text-text-secondary mt-1 text-right">
            {entry.text_notes?.length ?? 0} characters
            {saving && ' — saving...'}
          </p>
        </div>

        {/* Photos */}
        <PhotoUploader
          photos={entry.photo_urls ?? []}
          entryId={entry.id}
          onPhotoAdded={(url) => {
            const updated = [...(entry.photo_urls ?? []), url]
            patch({ photo_urls: updated } as unknown as Partial<Entry>)
          }}
          onPhotoRemoved={(url) => {
            const updated = (entry.photo_urls ?? []).filter((u) => u !== url)
            patch({ photo_urls: updated } as unknown as Partial<Entry>)
          }}
          onPhotoClick={setLightboxUrl}
        />

        {/* Voice Clips */}
        <VoiceRecorder
          clips={(entry.voice_clip_urls ?? []).map((url, i) => ({ url, timestamp: i }))}
          entryId={entry.id}
          onClipAdded={(url) => {
            const updated = [...(entry.voice_clip_urls ?? []), url]
            patch({ voice_clip_urls: updated } as unknown as Partial<Entry>)
          }}
          onClipRemoved={(url) => {
            const updated = (entry.voice_clip_urls ?? []).filter((u) => u !== url)
            patch({ voice_clip_urls: updated } as unknown as Partial<Entry>)
          }}
        />

        {/* Description (curated/published) */}
        {(entry.status === 'curated' || entry.status === 'published') && (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Description</p>
            <textarea
              value={entry.description ?? ''}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Write your formal description of this site for publication..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text-primary resize-y focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        )}

        {/* Readings */}
        <div>
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Readings</p>
          {entry.readings?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {entry.readings.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-light text-sm text-accent">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{r.title}</a>
                  ) : (
                    r.title
                  )}
                  {r.source && <span className="text-text-secondary text-xs">({r.source})</span>}
                  <button onClick={() => removeReading(i)} className="ml-1 text-accent/60 hover:text-accent">x</button>
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2">
            <input
              value={newReading.title}
              onChange={(e) => setNewReading({ ...newReading, title: e.target.value })}
              placeholder="Title"
              className="px-3 py-1.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              value={newReading.source}
              onChange={(e) => setNewReading({ ...newReading, source: e.target.value })}
              placeholder="Source"
              className="px-3 py-1.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              value={newReading.url}
              onChange={(e) => setNewReading({ ...newReading, url: e.target.value })}
              placeholder="URL"
              className="px-3 py-1.5 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button onClick={addReading} className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Sticky status controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {entry.status === 'published' && entry.published_at &&
              `Published on ${new Date(entry.published_at).toLocaleDateString()}`}
          </span>
          <div className="flex gap-3">
            {entry.status === 'draft' && (
              <button
                disabled={!canCurate}
                onClick={() => patch({ status: 'curated' } as Partial<Entry>)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50"
              >
                Mark as Curated
              </button>
            )}
            {entry.status === 'curated' && (
              <button
                disabled={!canPublish}
                onClick={() => {
                  if (confirm('This will make this entry visible on historywithck.vercel.app. Are you sure?')) {
                    patch({ status: 'published' } as Partial<Entry>)
                  }
                }}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium disabled:opacity-50"
              >
                Publish to Website
              </button>
            )}
            {entry.status === 'published' && (
              <button
                onClick={() => patch({ status: 'curated' } as Partial<Entry>)}
                className="text-sm text-text-secondary hover:text-text-primary"
              >
                Unpublish
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
