import * as React from "react"
import {
  DateField as AriaDateField,
  DateInput as AriaDateInput,
  Label as AriaLabel,
  Text as AriaText,
  DateSegment,
} from "react-aria-components"

import { cn } from "@nhic/currantui/lib/utils"
import type {
  DateFieldProps as AriaDateFieldProps,
  DateValue,
} from "react-aria-components"

const dateFieldLabelClasses =
  "flex w-fit items-center gap-1.5 text-sm/relaxed leading-none font-medium select-none"

const dateInputClasses =
  "flex h-7 w-full items-center rounded-md border border-input bg-input/20 px-2 text-sm/relaxed transition-colors data-[focus-within]:border-ring data-[focus-within]:ring-2 data-[focus-within]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-2 data-[invalid]:ring-destructive/20 dark:bg-input/30 dark:data-[invalid]:border-destructive/50 dark:data-[invalid]:ring-destructive/40"

const dateSegmentClasses =
  "rounded-sm px-0.5 tabular-nums caret-transparent outline-none data-[type=literal]:px-0 data-[type=literal]:text-muted-foreground data-[placeholder]:text-muted-foreground data-[focused]:bg-primary data-[focused]:text-primary-foreground data-[focused]:data-[placeholder]:text-primary-foreground data-[disabled]:opacity-50"

/**
 * Segmented, keyboard-editable date input. Pass `label` (or `aria-label`)
 * for the accessible name; values come from `@nhic/currantui/lib/date`.
 */
function DateField<T extends DateValue>({
  label,
  description,
  className,
  ...props
}: Omit<AriaDateFieldProps<T>, "className"> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <AriaDateField
      data-slot="date-field"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel data-slot="date-field-label" className={dateFieldLabelClasses}>
          {label}
        </AriaLabel>
      )}
      <AriaDateInput data-slot="date-field-input" className={dateInputClasses}>
        {(segment) => (
          <DateSegment
            data-slot="date-field-segment"
            segment={segment}
            className={dateSegmentClasses}
          />
        )}
      </AriaDateInput>
      {description != null && (
        <AriaText
          data-slot="date-field-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
    </AriaDateField>
  )
}

export { DateField, dateFieldLabelClasses, dateInputClasses, dateSegmentClasses }
