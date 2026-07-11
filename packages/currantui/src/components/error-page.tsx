import { HicLogo } from "@nhic/currantui/components/hic-logo"
import type { ReactNode } from "react"

interface ErrorPageProps {
  code?: string | number
  headline?: string
  detail?: string
  logo?: ReactNode
}

export function ErrorPage({ code, headline = "That's an error.", detail, logo }: ErrorPageProps) {
  return (
    <main className="min-h-screen bg-background text-sm">
      <div className="mx-auto flex max-w-[820px] items-start justify-center gap-24 px-8 pt-[210px]">
        {/* Left Content */}
        <div className="max-w-[340px]">
          <div className="mb-8 flex items-center">
            {logo ?? <HicLogo className="[&_img]:h-7" />}
          </div>

          <div className="space-y-5">
            <p className="flex leading-none font-normal">
              {code && (
                <span className="font-semibold text-foreground">{code}. </span>
              )}
              {headline && <span className="text-muted-foreground">{headline}</span>}
            </p>

            <div className="leading-[1.55] space-y-1">
              {detail && <p className="text-foreground">{detail}</p>}
              <p className="text-muted-foreground">That&apos;s all we know.</p>
            </div>
          </div>
        </div>

        {/* Robot Illustration */}
        <div className="hidden md:flex">
          <BrokenRobotSvg size={150} />
        </div>
      </div>
    </main>
  )
}

/* Isometric broken robot — matches the Google error page illustration style */
function BrokenRobotSvg({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Antenna */}
        <line x1="110" y1="18" x2="110" y2="38" />
        <circle cx="110" cy="12" r="5" />

        {/* Head */}
        <rect x="82" y="38" width="56" height="42" rx="3" />
        <circle cx="98" cy="55" r="3" />
        <circle cx="122" cy="55" r="3" />
        <path d="M96 68H124" />

        {/* Neck */}
        <line x1="110" y1="80" x2="110" y2="92" />

        {/* Body */}
        <rect x="78" y="92" width="64" height="64" rx="4" />

        {/* Arms */}
        <line x1="78" y1="112" x2="58" y2="98" />
        <line x1="58" y1="98" x2="40" y2="102" />
        <line x1="40" y1="102" x2="28" y2="92" />

        <line x1="142" y1="112" x2="160" y2="120" />
        <line x1="160" y1="120" x2="178" y2="132" />

        {/* Left claw */}
        <line x1="22" y1="88" x2="28" y2="92" />
        <line x1="26" y1="84" x2="28" y2="92" />

        {/* Legs */}
        <line x1="96" y1="156" x2="88" y2="182" />
        <line x1="124" y1="156" x2="134" y2="182" />

        {/* Broken parts */}
        <rect
          x="40"
          y="170"
          width="18"
          height="8"
          transform="rotate(-25 40 170)"
        />
        <rect
          x="74"
          y="192"
          width="20"
          height="8"
          transform="rotate(20 74 192)"
        />
        <rect
          x="126"
          y="188"
          width="20"
          height="8"
          transform="rotate(-18 126 188)"
        />

        {/* Nuts / debris */}
        <circle cx="98" cy="186" r="2" />
        <circle cx="146" cy="196" r="2" />
        <circle cx="168" cy="182" r="2" />
        <path d="M170 170c4-3 8-3 12 0" />
      </g>
    </svg>
  )
}
