'use client'

import Link from 'next/link'
import { StatusBadge } from './StatusBadge'

interface ResearchEntry {
  id: string
  site_name: string
  site_city: string
  date: string
  city: string
  status: string
}

export function ResearchEntryCard({ entry }: { entry: ResearchEntry }) {
  return (
    <Link href={`/research/${entry.id}`}>
      <div className="bg-surface rounded-xl shadow-sm border border-border p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-text-primary">{entry.site_name}</p>
            <p className="text-sm text-text-secondary mt-0.5">{entry.site_city}</p>
            <p className="font-mono text-xs text-text-secondary mt-1">{entry.date}</p>
          </div>
          <StatusBadge status={entry.status} />
        </div>
      </div>
    </Link>
  )
}
