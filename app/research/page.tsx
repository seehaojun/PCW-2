'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { NavBar } from '@/components/NavBar'
import { CityNav, CITY_DATES } from '@/components/CityNav'
import { ResearchEntryCard } from '@/components/ResearchEntryCard'
import { OfflineBanner } from '@/components/OfflineBanner'

interface ResearchEntry {
  id: string
  site_name: string
  site_city: string
  date: string
  city: string
  status: string
}

export default function ResearchPage() {
  const { status } = useSession()
  const [entries, setEntries] = useState<ResearchEntry[]>([])
  const [city, setCity] = useState('Vienna')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/research')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
  }, [status])

  const cityEntries = entries.filter((e) => {
    if (city === 'London') {
      const range = CITY_DATES['London']
      return e.date >= range.start && e.date <= range.end
    }
    return e.city === city
  })

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
      <OfflineBanner />
      <CityNav selected={city} onSelect={setCity} />
      <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {cityEntries.map((entry) => (
          <ResearchEntryCard key={entry.id} entry={entry} />
        ))}
        {cityEntries.length === 0 && (
          <p className="text-text-secondary text-sm text-center py-8">No research entries for this city.</p>
        )}
      </div>
    </>
  )
}
