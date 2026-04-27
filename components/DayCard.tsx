'use client'

import { useState } from 'react'
import { buildMapsUrl } from '@/lib/maps'

interface TripDay {
  id: string
  date: string
  day_label: string
  city: string
  accom_name: string | null
  accom_checkin: string | null
  accom_checkout: string | null
  accom_address: string | null
  accom_lat: number | null
  accom_lng: number | null
  family_activity: string | null
  boys_activity: string | null
  ck_site_name: string | null
  ck_site_address: string | null
  ck_site_lat: number | null
  ck_site_lng: number | null
  remarks: string | null
  transit_note: string | null
}

export function DayCard({ day, isToday }: { day: TripDay; isToday: boolean }) {
  const [expanded, setExpanded] = useState(isToday)

  return (
    <div
      id={`day-${day.date}`}
      className={`bg-surface rounded-xl shadow-sm border border-border overflow-hidden ${
        isToday ? 'ring-2 ring-accent/30 bg-accent-light/30' : ''
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div>
          <p className="font-mono text-xs text-text-secondary">{day.day_label}</p>
          <p className="font-semibold text-text-primary">{day.city}</p>
        </div>
        <div className="flex items-center gap-2">
          {day.transit_note && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
              {day.transit_note.includes('Flight') ? '✈' : '🚂'} Transit
            </span>
          )}
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
          {day.transit_note && (
            <p className="text-sm text-warning font-medium">{day.transit_note}</p>
          )}

          {(day.accom_name || day.accom_checkin || day.accom_checkout) && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">Accommodation</p>
              {day.accom_name && <p className="text-sm font-medium">{day.accom_name}</p>}
              <div className="flex gap-3 text-xs text-text-secondary">
                {day.accom_checkin && <span>{day.accom_checkin}</span>}
                {day.accom_checkout && <span>{day.accom_checkout}</span>}
              </div>
              {day.accom_address && day.accom_lat && day.accom_lng && (
                <a
                  href={buildMapsUrl(day.accom_lat, day.accom_lng)}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline mt-0.5 inline-block"
                >
                  {day.accom_address}
                </a>
              )}
            </div>
          )}

          {day.family_activity && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                <span className="mr-1">🏛</span>Today
              </p>
              <p className="text-sm text-text-primary">{day.family_activity}</p>
            </div>
          )}

          {day.boys_activity && (
            <details className="group">
              <summary className="text-xs font-medium text-text-secondary uppercase tracking-wide cursor-pointer">
                Details &rarr;
              </summary>
              <p className="text-sm text-text-secondary mt-1">{day.boys_activity}</p>
            </details>
          )}

          {day.ck_site_name && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
                <span className="mr-1">📍</span>CK&apos;s site
              </p>
              <p className="text-sm text-text-primary">{day.ck_site_name}</p>
              {day.ck_site_lat && day.ck_site_lng && (
                <a
                  href={buildMapsUrl(day.ck_site_lat, day.ck_site_lng)}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  Open in Maps
                </a>
              )}
            </div>
          )}

          {day.remarks && (
            <div className="bg-warning/10 rounded-lg p-3">
              <p className="text-sm text-warning">{day.remarks}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export type { TripDay }
