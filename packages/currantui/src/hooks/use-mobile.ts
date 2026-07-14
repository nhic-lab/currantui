import * as React from "react"

/* Matches Tailwind's `max-lg:` exactly so CSS and JS agree on the breakpoint */
const MOBILE_QUERY = "(max-width: 1023px)"

function subscribe(callback: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )
}

export { useIsMobile }
