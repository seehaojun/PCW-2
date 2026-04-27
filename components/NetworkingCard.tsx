'use client'

function linkifyText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.(com|ai|io|org|net)[^\s]*)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (urlRegex.test(part) && part.length > 4) {
      const href = part.startsWith('http') ? part : `https://${part}`
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {part}
        </a>
      )
    }
    return part
  })
}

interface NetworkingDay {
  date: string
  day_label: string
  city: string
  hj_networking: string
}

export function NetworkingCard({ day }: { day: NetworkingDay }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border p-5">
      <p className="font-mono text-xs text-text-secondary">{day.day_label}</p>
      <p className="text-sm text-text-primary mt-2 leading-relaxed">{linkifyText(day.hj_networking)}</p>
    </div>
  )
}
