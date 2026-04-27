import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  const rows = await sql`
    SELECT e.*, t.date, t.city
    FROM ck_research_entries e
    JOIN trip_days t ON e.trip_day_id = t.id
    ORDER BY t.date ASC
  `
  return NextResponse.json(rows)
}
