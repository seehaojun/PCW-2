'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { NavBar } from '@/components/NavBar'
import { CityNav, CITY_DATES } from '@/components/CityNav'
import { DayCard, type TripDay } from '@/components/DayCard'
import { AccomCard } from '@/components/AccomCard'
import { OfflineBanner } from '@/components/OfflineBanner'

export default function FamilyPage() {
  const [days, setDays] = useState<TripDay[]>([])
  const [city, setCity] = useState('Vienna')
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/trip-days')
      .then((r) => r.json())
      .then((data) => {
        setDays(data)
        setLoading(false)
      })
  }, [])

  const cityDays = days.filter((d) => {
    if (city === 'London') {
      const range = CITY_DATES['London']
      return d.date >= range.start && d.date <= range.end
    }
    return d.city === city
  })

  const today = new Date().toISOString().slice(0, 10)

  const scrollToToday = useCallback(() => {
    setTimeout(() => {
      const el = document.getElementById(`day-${today}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [today])

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="flex-1 flex items-center justify-center text-text-secondary">Loading...</div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <OfflineBanner />
      <CityNav selected={city} onSelect={setCity} onScrollToToday={scrollToToday} />
      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-6 gap-6">
        <div ref={containerRef} className="flex-1 min-w-0 space-y-4">
          {cityDays.map((day) => (
            <DayCard key={day.id} day={day} isToday={day.date === today} />
          ))}
          {cityDays.length === 0 && (
            <p className="text-text-secondary text-sm text-center py-8">No days for this city.</p>
          )}
        </div>
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20">
            <AccomCard days={cityDays} />
          </div>
        </div>
      </div>
    </>
  )
}
