import { cn } from "@nhic/currantui/lib/utils"

interface HicLogoProps {
  compact?: boolean
  ministry?: string
  center?: string
  aria?: string
  /** Word stamp beside the lockup (e.g. "DOCS", "CALENDAR"); omitted when not provided */
  stamp?: string
  /** Coat-of-arms image URL; copy the packaged dist/assets/logo.svg to your public root or pass a bundler-imported URL */
  src?: string
  className?: string
}

export function HicLogo({
  compact = false,
  ministry = "Ministry of Health",
  center = "Health Intelligence Center",
  aria = "Ministry of Health — Health Intelligence Center",
  stamp,
  src = "/logo.svg",
  className,
}: HicLogoProps) {
  return (
    <span role="img" className={cn("inline-flex items-center gap-3", className)} aria-label={aria}>
      <img src={src} alt="" aria-hidden="true" className="h-11 w-auto shrink-0 object-contain" />
      {!compact && (
        <>
          <span className="flex flex-col max-sm:hidden">
            <span className="text-[0.8125rem] leading-[1.3] font-bold tracking-[-0.01em] whitespace-nowrap">
              {ministry}
            </span>
            <span className="my-[0.15rem] block h-px bg-current/25" />
            <span className="text-[0.625rem] font-normal tracking-[0.01em] whitespace-nowrap">
              {center}
            </span>
          </span>
          {stamp ? (
            <span
              aria-hidden="true"
              className="ml-2 self-center border border-primary/35 border-l-2 border-l-primary bg-primary/5 py-[0.2rem] pr-[0.4rem] pl-[0.35rem] text-[0.5rem] font-bold tracking-[0.18em] whitespace-nowrap text-primary uppercase max-sm:hidden"
            >
              {stamp}
            </span>
          ) : null}
        </>
      )}
    </span>
  )
}
