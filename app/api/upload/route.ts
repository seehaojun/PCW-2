import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ck') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ck') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  await del(url)
  return NextResponse.json({ ok: true })
}
