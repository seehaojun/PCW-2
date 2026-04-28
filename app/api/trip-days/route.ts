import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  const sql = getDb()
  const rows = await sql`SELECT * FROM trip_days ORDER BY date ASC`
  return NextResponse.json(rows)
}
