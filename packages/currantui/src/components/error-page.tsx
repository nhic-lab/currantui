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
      <div className="mx-auto flex max-w-[820px] items-center justify-center gap-16 px-8 pt-[210px]">
        {/* Left Content */}
        <div className="max-w-[340px] space-y-5">
          <div className="flex items-center">
            {logo ?? <HicLogo className="[&_img]:h-7" />}
          </div>

          <p className="leading-[1.55]">
            {(code || headline) && (
              <>
                {code && (
                  <span className="font-semibold text-foreground">
                    {code}.{" "}
                  </span>
                )}
                {headline && (
                  <span className="text-foreground">{headline}</span>
                )}
                <br />
              </>
            )}
            {detail && (
              <>
                <span className="text-foreground">{detail}</span>
                <br />
              </>
            )}
            <span className="text-muted-foreground">
              That&apos;s all we know.
            </span>
          </p>
        </div>

        {/* Not-found Illustration */}
        <div className="hidden md:flex">
          <NotFoundSvg size={170} />
        </div>
      </div>
    </main>
  )
}

/* Linear illustration — browser window searched by a magnifying glass;
   neutral strokes with a single primary accent */
function NotFoundSvg({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground"
      >
        {/* Browser window */}
        <rect x="28" y="46" width="130" height="110" rx="10" />
        <path d="M28 72H158" />
        <circle cx="42" cy="59" r="2" />
        <circle cx="52" cy="59" r="2" />
        <circle cx="62" cy="59" r="2" />

        {/* Content lines */}
        <path d="M44 92H112" />
        <path d="M44 106H96" />
        <path d="M44 120H104" />

        {/* Sparkles */}
        <path d="M178 34v12M172 40h12" />
        <path d="M22 24v8M18 28h8" />
        <circle cx="200" cy="120" r="2.5" />
        <circle cx="34" cy="184" r="2.5" />
      </g>

      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        {/* Magnifying glass */}
        <circle cx="146" cy="130" r="36" className="fill-background" />
        <path d="M172 155L196 179" />
        <path d="M194 172c3 0 7 4 7 7s-4 7-7 7-7-4-7-7" />

        {/* Question mark */}
        <path d="M138 120c0-6 4-10 9-10s9 4 9 9c0 7-9 7-9 14" />
        <path d="M147 141v1" />
      </g>
    </svg>
  )
}
