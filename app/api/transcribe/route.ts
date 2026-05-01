import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_BLOB_HOST = '.public.blob.vercel-storage.com'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
  }

  const { url } = await req.json()
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith(ALLOWED_BLOB_HOST)) {
    return NextResponse.json({ error: 'URL must be a Vercel Blob URL' }, { status: 400 })
  }

  const audioRes = await fetch(url)
  if (!audioRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch audio' }, { status: 502 })
  }
  const audioBlob = await audioRes.blob()

  const filename = parsed.pathname.split('/').pop() || 'audio.webm'
  const formData = new FormData()
  formData.append('file', audioBlob, filename)
  formData.append('model', 'whisper-1')

  const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })

  if (!whisperRes.ok) {
    const errText = await whisperRes.text()
    return NextResponse.json({ error: `Whisper request failed: ${errText}` }, { status: 502 })
  }

  const { text } = (await whisperRes.json()) as { text: string }
  return NextResponse.json({ transcription: text ?? '' })
}
