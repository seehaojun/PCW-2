'use client'

import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [offline, setOffline] = useState(false)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    setOffline(!navigator.onLine)

    const goOffline = () => setOffline(true)
    const goOnline = () => {
      setOffline(false)
      setSynced(true)
      setTimeout(() => setSynced(false), 3000)
    }

    window.addEventListener('offline', goOffline)
    window.addEventListener('online', goOnline)
    return () => {
      window.removeEventListener('offline', goOffline)
      window.removeEventListener('online', goOnline)
    }
  }, [])

  if (synced) {
    return (
      <div className="bg-accent-light text-accent text-sm text-center py-2 px-4">
        Synced
      </div>
    )
  }

  if (!offline) return null

  return (
    <div className="bg-warning/15 text-warning text-sm text-center py-2 px-4">
      You&apos;re offline — changes are saved locally and will sync when reconnected.
    </div>
  )
}
