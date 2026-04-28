import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string
  const entryId = formData.get('entryId') as string

  if (!file || !folder || !entryId) {
    return NextResponse.json({ error: 'Missing file, folder, or entryId' }, { status: 400 })
  }

  const timestamp = Date.now()
  const pathname = `${folder}/${entryId}/${timestamp}_${file.name}`

  const blob = await put(pathname, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}

export async function DELETE(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  await del(url)
  return NextResponse.json({ ok: true })
}
