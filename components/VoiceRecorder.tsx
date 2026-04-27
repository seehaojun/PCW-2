'use client'

import { useState, useRef } from 'react'

interface VoiceClip {
  url: string
  timestamp: number
}

interface VoiceRecorderProps {
  clips: VoiceClip[]
  entryId: string
  onClipAdded: (url: string) => void
  onClipRemoved: (url: string) => void
}

export function VoiceRecorder({ clips, entryId, onClipAdded, onClipRemoved }: VoiceRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [uploading, setUploading] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    const recorder = new MediaRecorder(stream, { mimeType })
    chunksRef.current = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const ext = mimeType === 'audio/webm' ? 'webm' : 'mp4'
      const file = new File([blob], `${Date.now()}.${ext}`, { type: mimeType })

      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'ck-voice-clips')
      formData.append('entryId', entryId)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        onClipAdded(url)
      }
      setUploading(false)
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setRecording(true)
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function deleteClip(url: string) {
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    onClipRemoved(url)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Voice Clips</p>
        {recording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Stop
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={uploading}
            className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Record'}
          </button>
        )}
      </div>
      {clips.length > 0 && (
        <div className="space-y-2">
          {clips.map((clip, i) => (
            <div key={clip.url} className="flex items-center gap-3 bg-bg rounded-lg p-2">
              <audio controls src={clip.url} className="h-8 flex-1" />
              <span className="text-xs text-text-secondary">Clip {i + 1}</span>
              <button onClick={() => deleteClip(clip.url)} className="text-xs text-red-500 hover:underline">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
