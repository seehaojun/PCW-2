import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const rows = await sql`
    SELECT e.*, t.date, t.city
    FROM ck_research_entries e
    JOIN trip_days t ON e.trip_day_id = t.id
    ORDER BY t.date ASC
  `
  return NextResponse.json(rows)
}
