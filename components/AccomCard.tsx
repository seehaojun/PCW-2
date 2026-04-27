'use client'

import { buildMapsUrl } from '@/lib/maps'
import type { TripDay } from './DayCard'

export function AccomCard({ days }: { days: TripDay[] }) {
  const first = days.find((d) => d.accom_name)
  if (!first) return null

  const checkin = days.find((d) => d.accom_checkin)?.accom_checkin
  const checkout = days.find((d) => d.accom_checkout)?.accom_checkout

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-5">
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Accommodation</p>
      <p className="font-semibold text-text-primary">{first.accom_name}</p>
      {first.accom_address && first.accom_lat && first.accom_lng && (
        <a
          href={buildMapsUrl(first.accom_lat, first.accom_lng)}
          target="_blank" rel="noopener noreferrer"
          className="text-sm text-accent hover:underline block mt-1"
        >
          {first.accom_address}
        </a>
      )}
      <div className="flex gap-3 mt-2 text-xs text-text-secondary">
        {checkin && <span>{checkin}</span>}
        {checkout && <span>{checkout}</span>}
      </div>
    </div>
  )
}
