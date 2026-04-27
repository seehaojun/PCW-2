'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  const role = session.user.role

  const links: { href: string; label: string }[] = []
  if (role === 'ck') {
    links.push({ href: '/research', label: 'Research' })
    links.push({ href: '/family', label: 'Family' })
  } else if (role === 'hj') {
    links.push({ href: '/networking', label: 'Networking' })
    links.push({ href: '/family', label: 'Family' })
  } else {
    links.push({ href: '/family', label: 'Family' })
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold text-xl text-text-primary tracking-tight">
        PCW2
      </Link>
      <div className="flex items-center gap-6">
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
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
