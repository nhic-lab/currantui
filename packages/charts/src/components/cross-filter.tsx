import * as React from "react"
import { XIcon } from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import { filterChipVariants } from "@nhic/currantui/components/filter-chip"
import { cn } from "@nhic/currantui/lib/utils"
import {
  clearSelections,
  isValueSelected,
  toggleSelection,
} from "@nhic/currantui-charts/lib/cross-filter"

import type { CrossFilterSelection } from "@nhic/currantui-charts/lib/cross-filter"

export type { CrossFilterSelection }

export interface CrossFilterContextValue {
  selections: Array<CrossFilterSelection>
  toggle: (dimension: string, value: string | number, additive?: boolean) => void
  clear: (dimension?: string) => void
  isSelected: (dimension: string, value: string | number) => boolean
  isActive: boolean
  /** False outside a provider — charts stay inert without one */
  enabled: boolean
}

const inertContext: CrossFilterContextValue = {
  selections: [],
  toggle: () => undefined,
  clear: () => undefined,
  isSelected: () => false,
  isActive: false,
  enabled: false,
}

const CrossFilterContext = React.createContext<CrossFilterContextValue>(inertContext)

function useCrossFilter(): CrossFilterContextValue {
  return React.useContext(CrossFilterContext)
}

function CrossFilterProvider({
  selections: controlled,
  defaultSelections = [],
  onSelectionsChange,
  children,
}: {
  selections?: Array<CrossFilterSelection>
  defaultSelections?: Array<CrossFilterSelection>
  onSelectionsChange?: (selections: Array<CrossFilterSelection>) => void
  children?: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultSelections)
  const selections = controlled ?? uncontrolled
  const selectionsRef = React.useRef(selections)
  selectionsRef.current = selections
  const onChangeRef = React.useRef(onSelectionsChange)
  onChangeRef.current = onSelectionsChange

  const update = React.useCallback((next: Array<CrossFilterSelection>) => {
    if (next === selectionsRef.current) return
    setUncontrolled(next)
    onChangeRef.current?.(next)
  }, [])

  const toggle = React.useCallback(
    (dimension: string, value: string | number, additive = false) => {
      update(toggleSelection(selectionsRef.current, dimension, value, additive))
    },
    [update]
  )

  const clear = React.useCallback(
    (dimension?: string) => {
      update(clearSelections(selectionsRef.current, dimension))
    },
    [update]
  )

  const value = React.useMemo<CrossFilterContextValue>(
    () => ({
      selections,
      toggle,
      clear,
      isSelected: (dimension, candidate) =>
        isValueSelected(selections, dimension, candidate),
      isActive: selections.length > 0,
      enabled: true,
    }),
    [selections, toggle, clear]
  )

  return (
    <CrossFilterContext.Provider value={value}>{children}</CrossFilterContext.Provider>
  )
}

/**
 * Active cross-filter selections as dismissible chips plus a clear-all
 * action. Renders an empty live region when nothing is selected so
 * screen readers hear selection changes.
 */
function CrossFilterBar({
  labels,
  className,
}: {
  /** Display names per dimension, e.g. { district: "District" } */
  labels?: Record<string, string>
  className?: string
}) {
  const { selections, toggle, clear, enabled } = useCrossFilter()
  if (!enabled) return null
  const total = selections.reduce((count, selection) => count + selection.values.length, 0)
  return (
    <div
      data-slot="cross-filter-bar"
      aria-live="polite"
      className={cn("flex min-h-6 flex-wrap items-center gap-1.5", className)}
    >
      {selections.flatMap((selection) =>
        selection.values.map((value) => {
          const dimensionLabel = labels?.[selection.dimension] ?? selection.dimension
          return (
            <button
              key={`${selection.dimension}:${String(value)}`}
              type="button"
              aria-label={`Remove filter ${dimensionLabel}: ${String(value)}`}
              className={cn(filterChipVariants({ active: true }), "gap-1")}
              onClick={() => toggle(selection.dimension, value, true)}
            >
              <span>
                {dimensionLabel}: {String(value)}
              </span>
              <XIcon aria-hidden="true" className="size-3" />
            </button>
          )
        })
      )}
      {total >= 2 && (
        <Button variant="ghost" size="sm" onClick={() => clear()}>
          Clear all
        </Button>
      )}
    </div>
  )
}

export { CrossFilterBar, CrossFilterProvider, useCrossFilter }
