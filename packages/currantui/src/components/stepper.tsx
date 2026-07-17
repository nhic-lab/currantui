import * as React from "react"

import {
  CheckCircleIcon,
  CircleIcon,
  RadioButtonIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"

type StepperOrientation = "horizontal" | "vertical"
type StepState = "incomplete" | "current" | "complete" | "invalid"

const StepperContext = React.createContext<StepperOrientation>("horizontal")

const stepLineVariants = cva("", {
  variants: {
    state: {
      incomplete: "border-border",
      current: "border-primary",
      complete: "border-primary",
      invalid: "border-destructive",
    },
  },
  defaultVariants: { state: "incomplete" },
})

const STEP_ICONS: Record<
  StepState,
  { Icon: React.ElementType; weight: "regular" | "fill"; className: string }
> = {
  incomplete: { Icon: CircleIcon, weight: "regular", className: "text-muted-foreground" },
  current: { Icon: RadioButtonIcon, weight: "fill", className: "text-primary" },
  complete: { Icon: CheckCircleIcon, weight: "fill", className: "text-primary" },
  invalid: { Icon: WarningCircleIcon, weight: "fill", className: "text-destructive" },
}

const STEP_STATE_LABELS: Record<StepState, string | null> = {
  incomplete: null,
  current: null,
  complete: "Completed:",
  invalid: "Error:",
}

/**
 * Multi-step progress indicator (setup flows, wizards). Steps are static
 * status, not navigation — wrap step content in a Link/button via `title`
 * when steps are clickable.
 */
function Stepper({
  orientation = "horizontal",
  className,
  ...props
}: React.ComponentProps<"ol"> & { orientation?: StepperOrientation }) {
  return (
    <StepperContext.Provider value={orientation}>
      <ol
        data-slot="stepper"
        data-orientation={orientation}
        className={cn(
          "flex",
          orientation === "vertical" && "flex-col",
          className
        )}
        {...props}
      />
    </StepperContext.Provider>
  )
}

function StepperItem({
  state = "incomplete",
  title,
  description,
  disabled = false,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "title"> & {
  state?: StepState
  title: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}) {
  const orientation = React.useContext(StepperContext)
  const { Icon, weight, className: iconClassName } = STEP_ICONS[state]
  const stateLabel = STEP_STATE_LABELS[state]

  /* text-sm/relaxed first lines are ~23px tall; nudge the 16px marker down so
     it centers on the title's first line instead of riding high */
  const marker = (
    <Icon
      weight={weight}
      aria-hidden="true"
      className={cn("mt-[3px] size-4 shrink-0", iconClassName)}
    />
  )
  const label = (
    <>
      {stateLabel && <span className="sr-only">{stateLabel} </span>}
      <div
        data-slot="stepper-item-title"
        className="text-sm/relaxed font-medium text-foreground"
      >
        {title}
      </div>
      {description && (
        <div
          data-slot="stepper-item-description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </div>
      )}
    </>
  )

  if (orientation === "vertical") {
    return (
      <li
        data-slot="stepper-item"
        data-state={state}
        aria-current={state === "current" ? "step" : undefined}
        aria-disabled={disabled || undefined}
        className={cn(
          "group/stepper-item flex gap-2",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center">
          {marker}
          <span
            aria-hidden="true"
            className={cn(
              "my-1 flex-1 border-s-2 group-last/stepper-item:hidden",
              stepLineVariants({ state })
            )}
          />
        </div>
        <div className="min-w-0 pb-5 group-last/stepper-item:pb-0">{label}</div>
      </li>
    )
  }

  return (
    <li
      data-slot="stepper-item"
      data-state={state}
      aria-current={state === "current" ? "step" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "group/stepper-item min-w-28 flex-1 pe-2 last:pe-0",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("block border-t-2", stepLineVariants({ state }))}
      />
      <div className="flex items-start gap-1.5 pt-2">
        {marker}
        <div className="min-w-0">{label}</div>
      </div>
    </li>
  )
}

export { Stepper, StepperItem }
