import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const { entryId } = await params
  const sql = getDb()
  const rows = await sql`
    SELECT e.*, t.date, t.city
    FROM ck_research_entries e
    JOIN trip_days t ON e.trip_day_id = t.id
    WHERE e.id = ${entryId}
  `
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const { entryId } = await params
  const body = await req.json()
  const sql = getDb()

  if (body.text_notes !== undefined) {
    await sql`UPDATE ck_research_entries SET text_notes = ${body.text_notes} WHERE id = ${entryId}`
  }

  if (body.description !== undefined) {
    await sql`UPDATE ck_research_entries SET description = ${body.description} WHERE id = ${entryId}`
  }

  if (body.readings !== undefined) {
    await sql`UPDATE ck_research_entries SET readings = ${JSON.stringify(body.readings)} WHERE id = ${entryId}`
  }

  if (body.status !== undefined) {
    if (body.status === 'published') {
      await sql`UPDATE ck_research_entries SET status = 'published', published_at = now() WHERE id = ${entryId}`
    } else {
      await sql`UPDATE ck_research_entries SET status = ${body.status}, published_at = NULL WHERE id = ${entryId}`
    }
  }

  if (body.voice_clip_urls !== undefined) {
    await sql`UPDATE ck_research_entries SET voice_clip_urls = ${body.voice_clip_urls} WHERE id = ${entryId}`
  }

  if (body.photo_urls !== undefined) {
    await sql`UPDATE ck_research_entries SET photo_urls = ${body.photo_urls} WHERE id = ${entryId}`
  }

  const rows = await sql`
    SELECT e.*, t.date, t.city
    FROM ck_research_entries e
    JOIN trip_days t ON e.trip_day_id = t.id
    WHERE e.id = ${entryId}
  `
  return NextResponse.json(rows[0])
}
