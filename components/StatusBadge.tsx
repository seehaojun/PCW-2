'use client'

const styles: Record<string, string> = {
  draft: 'bg-warning/15 text-warning',
  curated: 'bg-blue-100 text-blue-700',
  published: 'bg-accent-light text-success',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? ''}`}>
      {status}
    </span>
  )
}
