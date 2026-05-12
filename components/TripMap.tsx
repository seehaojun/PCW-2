'use client'

import { useEffect, useRef } from 'react'
import type { TripDay } from './DayCard'

const CITY_ORDER = ['Vienna', 'Bratislava', 'Győr', 'Budapest', 'Warsaw', 'Kraków', 'Paris', 'London']

const CITY_CENTERS: Record<string, { lat: number; lng: number; country: string }> = {
  Vienna:     { lat: 48.2082, lng: 16.3738, country: 'Austria' },
  Bratislava: { lat: 48.1486, lng: 17.1077, country: 'Slovakia' },
  'Győr':     { lat: 47.6875, lng: 17.6504, country: 'Hungary' },
  Budapest:   { lat: 47.4979, lng: 19.0402, country: 'Hungary' },
  Warsaw:     { lat: 52.2297, lng: 21.0122, country: 'Poland' },
  'Kraków':   { lat: 50.0647, lng: 19.9450, country: 'Poland' },
  Paris:      { lat: 48.8566, lng:  2.3522, country: 'France' },
  London:     { lat: 51.5074, lng: -0.1278, country: 'UK' },
}

interface Stay {
  city: string
  name: string
  address: string | null
  lat: number
  lng: number
  startDate: string
  endDate: string
}

function uniqueStays(days: TripDay[]): Stay[] {
  const map = new Map<string, Stay>()
  for (const d of days) {
    if (!d.accom_name || d.accom_lat == null || d.accom_lng == null) continue
    const key = `${d.accom_name}|${d.accom_lat}|${d.accom_lng}`
    const existing = map.get(key)
    if (existing) {
      if (d.date < existing.startDate) existing.startDate = d.date
      if (d.date > existing.endDate) existing.endDate = d.date
    } else {
      map.set(key, {
        city: d.city,
        name: d.accom_name,
        address: d.accom_address,
        lat: d.accom_lat,
        lng: d.accom_lng,
        startDate: d.date,
        endDate: d.date,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.startDate.localeCompare(b.startDate))
}

function formatRange(start: string, end: string): string {
  const fmt = (s: string) => {
    const [, m, d] = s.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]}`
  }
  return start === end ? fmt(start) : `${fmt(start)} – ${fmt(end)}`
}

let leafletLoader: Promise<void> | null = null
function loadLeaflet(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  // @ts-expect-error window.L is added by leaflet
  if (window.L) return Promise.resolve()
  if (leafletLoader) return leafletLoader
  leafletLoader = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      link.setAttribute('data-leaflet', 'true')
      document.head.appendChild(link)
    }
    if (!document.querySelector('script[data-leaflet]')) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      script.async = true
      script.setAttribute('data-leaflet', 'true')
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Leaflet'))
      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
  return leafletLoader
}

export function TripMap({ days }: { days: TripDay[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    let cancelled = false

    loadLeaflet().then(() => {
      if (cancelled || !containerRef.current) return
      // @ts-expect-error leaflet runtime
      const L = window.L
      if (!L) return

      // Tear down a stale map if hot-reloaded
      if (mapRef.current) {
        // @ts-expect-error leaflet runtime
        mapRef.current.remove()
        mapRef.current = null
      }

      const map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([50, 14], 5)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      const cityLatLngs = CITY_ORDER.map((c) => [CITY_CENTERS[c].lat, CITY_CENTERS[c].lng])
      L.polyline(cityLatLngs, {
        color: '#2D5A3D',
        weight: 2.5,
        opacity: 0.6,
        dashArray: '6,6',
      }).addTo(map)

      CITY_ORDER.forEach((city, idx) => {
        const c = CITY_CENTERS[city]
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background:#2D5A3D;
            color:#fff;
            border-radius:9999px;
            width:28px;height:28px;
            display:flex;align-items:center;justify-content:center;
            font-size:13px;font-weight:600;
            border:2px solid #fff;
            box-shadow:0 1px 4px rgba(0,0,0,0.25);
          ">${idx + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
        const marker = L.marker([c.lat, c.lng], { icon, zIndexOffset: 500 }).addTo(map)
        marker.bindTooltip(
          `<b>${city}</b><br><span style="color:#6B6860">${c.country}</span>`,
          { permanent: true, direction: 'top', offset: [0, -16], className: 'pcw-city-label' },
        )
      })

      const stays = uniqueStays(days)
      const stayLatLngs: [number, number][] = []
      stays.forEach((s) => {
        const stayIcon = L.divIcon({
          className: '',
          html: `<div style="
            background:#fff;
            border:2px solid #2D5A3D;
            border-radius:9999px;
            width:12px;height:12px;
            box-shadow:0 1px 3px rgba(0,0,0,0.25);
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        })
        const tooltipHtml = `
          <div style="min-width:160px">
            <div style="font-weight:600;color:#1A1916">${s.name}</div>
            <div style="color:#6B6860;font-size:11px;margin-top:2px">${s.city} · ${formatRange(s.startDate, s.endDate)}</div>
            ${s.address ? `<div style="color:#6B6860;font-size:11px;margin-top:2px">${s.address}</div>` : ''}
          </div>
        `
        const marker = L.marker([s.lat, s.lng], { icon: stayIcon }).addTo(map)
        marker.bindTooltip(tooltipHtml, {
          direction: 'top',
          offset: [0, -8],
          className: 'pcw-stay-label',
        })
        stayLatLngs.push([s.lat, s.lng])
      })

      const allPoints = [...cityLatLngs, ...stayLatLngs] as [number, number][]
      if (allPoints.length > 0) {
        map.fitBounds(allPoints, { padding: [40, 40] })
      }
    }).catch(() => {
      /* network failure — leave the placeholder visible */
    })

    return () => {
      cancelled = true
      if (mapRef.current) {
        // @ts-expect-error leaflet runtime
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [days])

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">Trip Map</p>
        <p className="text-sm text-text-secondary mt-0.5">8 cities · {uniqueStays(days).length} stays · 17 May – 26 Jun 2026</p>
      </div>
      <div
        ref={containerRef}
        className="w-full"
        style={{ height: 420 }}
        aria-label="Trip map showing all cities and stays"
      />
    </div>
  )
}
