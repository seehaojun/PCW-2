'use client'

interface PhotoLightboxProps {
  url: string
  onClose: () => void
}

export function PhotoLightbox({ url, onClose }: PhotoLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center"
      >
        x
      </button>
      <img
        src={url}
        alt=""
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
