import { cn } from "../lib/utils"

interface LogoProps {
  size?: number
  className?: string
  showWordmark?: boolean
}

export function Logo({ size = 22, className, showWordmark = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="eradia-lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary-deep)" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="7" fill="url(#eradia-lg)" />
        {/* stylised 'e' */}
        <path
          d="M10 11h8a4 4 0 1 1 0 8h-5"
          stroke="var(--bg, #0B0E12)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
        {/* radiating arc */}
        <path
          d="M21 22a8 8 0 0 0 0-12"
          stroke="var(--bg, #0B0E12)"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {showWordmark && (
        <span
          className="font-heading text-base font-bold tracking-tight leading-none text-(--text)"
        >
          eRadia
        </span>
      )}
    </div>
  )
}
