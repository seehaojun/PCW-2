'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/family', label: 'Family' },
  { href: '/research', label: 'Research' },
  { href: '/networking', label: 'Networking' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center justify-between gap-4">
      <Link href="/" className="shrink-0 font-semibold text-xl text-text-primary tracking-tight">
        PCW2
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              pathname.startsWith(link.href)
                ? 'text-accent underline underline-offset-4'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
