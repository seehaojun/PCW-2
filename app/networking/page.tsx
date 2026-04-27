'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { NavBar } from '@/components/NavBar'
import { CityNav, CITY_DATES } from '@/components/CityNav'
import { NetworkingCard } from '@/components/NetworkingCard'
import { QuickRefTable } from '@/components/QuickRefTable'

interface TripDay {
  id: string
  date: string
  day_label: string
  city: string
  hj_networking: string | null
}

export default function NetworkingPage() {
  const { status } = useSession()
  const [days, setDays] = useState<TripDay[]>([])
  const [city, setCity] = useState('Vienna')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/trip-days')
      .then((r) => r.json())
      .then((data) => {
        setDays(data)
        setLoading(false)
      })
  }, [status])

  const cityDays = days
    .filter((d) => {
      if (city === 'London') {
        const range = CITY_DATES['London']
        return d.date >= range.start && d.date <= range.end
      }
      return d.city === city
    })
    .filter((d) => d.hj_networking)

  if (status === 'loading' || loading) {
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
      <CityNav selected={city} onSelect={setCity} />
      <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {cityDays.map((day) => (
          <NetworkingCard
            key={day.id}
            day={{ date: day.date, day_label: day.day_label, city: day.city, hj_networking: day.hj_networking! }}
          />
        ))}
        {cityDays.length === 0 && (
          <p className="text-text-secondary text-sm text-center py-8">No networking days for this city.</p>
        )}
        <QuickRefTable />
      </div>
    </>
  )
}
