import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const rows = await sql`
    SELECT * FROM ck_research_entries WHERE status = 'published'
  `
  return NextResponse.json(rows)
}
