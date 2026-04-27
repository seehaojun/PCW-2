'use client'

import { useState } from 'react'

const quickRef = [
  { city: 'Vienna', dates: '17-22 May', opp: 'ViennaUP 2026 (18-22 May) - AI/deeptech track, free events. PeaceTech Conference (ethical AI, 20 May). AI Factory Austria (AI:AT) drop-in.' },
  { city: 'Bratislava', dates: '24-27 May', opp: 'Small scene. LinkedIn outreach + coworking day passes.' },
  { city: 'Gyor', dates: '28-29 May', opp: 'Not a tech hub. Admin / outreach days.' },
  { city: 'Budapest', dates: '30 May-4 Jun', opp: 'Impact Hub, Kaptar, Design Terminal. Active AI startup scene. Budapest Startup Safari events.' },
  { city: 'Warsaw', dates: '5-6 Jun', opp: 'Google for Startups Campus, The Heart (38th floor Warsaw Spire). Warsaw.AI meetup community.' },
  { city: 'Krakow', dates: '7-12 Jun', opp: 'Innovation Nest, Hub:raum (Deutsche Telekom), Krakow Technology Park.' },
  { city: 'Paris', dates: '13-17 Jun', opp: 'Station F (world\'s largest startup campus, F/ai program). La French Tech. Mistral AI HQ is here.' },
  { city: 'London', dates: '18-26 Jun', opp: 'AI Tinkerers London, London AI Developers Group (Google collaboration), Mindstone AI Meetup. Shoreditch/Old Street tech hub.' },
]

export function QuickRefTable() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-text-primary">Quick Reference</span>
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 text-text-secondary font-medium">City</th>
                <th className="py-2 pr-4 text-text-secondary font-medium">Dates</th>
                <th className="py-2 text-text-secondary font-medium">Key Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {quickRef.map((row) => (
                <tr key={row.city} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-medium">{row.city}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-text-secondary whitespace-nowrap">{row.dates}</td>
                  <td className="py-2 text-text-secondary">{row.opp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
