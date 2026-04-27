'use client'

import { useRef, useState } from 'react'

interface PhotoUploaderProps {
  photos: string[]
  entryId: string
  onPhotoAdded: (url: string) => void
  onPhotoRemoved: (url: string) => void
  onPhotoClick: (url: string) => void
}

export function PhotoUploader({ photos, entryId, onPhotoAdded, onPhotoRemoved, onPhotoClick }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleFiles(files: FileList) {
    setUploading(true)
    const total = files.length
    let done = 0

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'ck-photos')
      formData.append('entryId', entryId)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        onPhotoAdded(url)
      }
      done++
      setProgress(Math.round((done / total) * 100))
    }

    setUploading(false)
    setProgress(0)
  }

  async function deletePhoto(url: string) {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    onPhotoRemoved(url)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Photos</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm disabled:opacity-50"
        >
          {uploading ? `Uploading ${progress}%` : 'Add Photos'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {photos.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {photos.map((url) => (
            <div key={url} className="relative group aspect-square">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover rounded-lg cursor-pointer"
                onClick={() => onPhotoClick(url)}
              />
              <button
                onClick={() => deletePhoto(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
