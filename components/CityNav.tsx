'use client'

const CITIES = ['Vienna', 'Bratislava', 'Győr', 'Budapest', 'Warsaw', 'Kraków', 'Paris', 'London']

const CITY_DATES: Record<string, { start: string; end: string }> = {
  Vienna:     { start: '2026-05-17', end: '2026-05-23' },
  Bratislava: { start: '2026-05-24', end: '2026-05-27' },
  'Győr':     { start: '2026-05-28', end: '2026-05-29' },
  Budapest:   { start: '2026-05-30', end: '2026-06-04' },
  Warsaw:     { start: '2026-06-05', end: '2026-06-06' },
  'Kraków':   { start: '2026-06-07', end: '2026-06-12' },
  Paris:      { start: '2026-06-13', end: '2026-06-17' },
  London:     { start: '2026-06-18', end: '2026-06-26' },
}

const TRIP_START = '2026-05-17'
const TRIP_END = '2026-06-26'

function getTodayCity(): string | null {
  const today = new Date().toISOString().slice(0, 10)
  if (today < TRIP_START || today > TRIP_END) return null
  for (const [city, range] of Object.entries(CITY_DATES)) {
    if (today >= range.start && today <= range.end) return city
  }
  return null
}

function daysUntilTrip(): number | null {
  const today = new Date()
  const start = new Date(TRIP_START)
  if (today >= start) return null
  return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

interface CityNavProps {
  selected: string
  onSelect: (city: string) => void
  onScrollToToday?: () => void
}

export function CityNav({ selected, onSelect, onScrollToToday }: CityNavProps) {
  const todayCity = getTodayCity()
  const daysLeft = daysUntilTrip()
  const today = new Date().toISOString().slice(0, 10)
  const tripEnded = today > TRIP_END

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-3 px-4 bg-surface border-b border-border scrollbar-hide">
      {CITIES.map((city) => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === city
              ? 'bg-accent text-white'
              : 'bg-bg text-text-secondary hover:text-text-primary hover:bg-accent-light'
          }`}
        >
          {city}
        </button>
      ))}
      {todayCity && (
        <button
          onClick={() => {
            onSelect(todayCity)
            onScrollToToday?.()
          }}
          className="shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-accent-light text-accent"
        >
          Today &rarr;
        </button>
      )}
      {daysLeft !== null && (
        <span className="shrink-0 px-4 py-2 text-sm text-text-secondary">
          Trip starts in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
        </span>
      )}
      {tripEnded && null}
    </div>
  )
}

export { CITIES, CITY_DATES, TRIP_START, TRIP_END }
