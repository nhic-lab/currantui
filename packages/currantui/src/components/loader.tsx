import * as React from "react"

import { cn } from "@nhic/currantui/lib/utils"

/* orbitR = circle/2 - border - dot/2 - gap */
const SIZES = {
  xs: { circle: 20, dot: 3, border: 2,   orbitR: 3.5 },
  sm: { circle: 28, dot: 4, border: 2.5, orbitR: 6   },
  md: { circle: 36, dot: 5, border: 3,   orbitR: 10  },
  lg: { circle: 48, dot: 6, border: 3.5, orbitR: 15  },
  xl: { circle: 60, dot: 8, border: 4,   orbitR: 20  },
} as const

type LoaderSize = keyof typeof SIZES

/* Three dots evenly spaced at 0°, 120°, 240° on the orbit ring */
const DOT_ANGLES = [0, 120, 240]

function dotStyle(angleDeg: number, orbitR: number, dotSize: number): React.CSSProperties {
  const rad = (angleDeg * Math.PI) / 180
  /* angle 0 = top, clockwise — x = sin(θ), y = -cos(θ) */
  const x = orbitR * Math.sin(rad)
  const y = -orbitR * Math.cos(rad)
  return {
    position: "absolute",
    width: dotSize,
    height: dotSize,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: "translate(-50%, -50%)",
  }
}

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: LoaderSize
  label?: string
}

function Loader({ size = "md", label = "Loading", className, ...props }: LoaderProps) {
  const { circle, dot, border, orbitR } = SIZES[size]

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("relative shrink-0 rounded-full border-foreground/65", className)}
      style={{ width: circle, height: circle, borderWidth: border }}
      {...props}
    >
      {/* Rotating wrapper — all 3 dots are fixed on this and spin together */}
      <div className="absolute inset-0 animate-orbit-spin" style={{ transformOrigin: "center center" }}>
        {DOT_ANGLES.map((angle, i) => (
          <div
            key={i}
            className="rounded-full bg-foreground/65"
            style={dotStyle(angle, orbitR, dot)}
          />
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

interface LoaderOverlayProps {
  label?: string
  className?: string
}

function LoaderOverlay({ label = "Loading", className }: LoaderOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80",
        className
      )}
    >
      <Loader size="xl" label={label} />
    </div>
  )
}

export { Loader, LoaderOverlay }
