import * as React from "react"
import {
  DateInput as AriaDateInput,
  Label as AriaLabel,
  Text as AriaText,
  TimeField as AriaTimeField,
  DateSegment,
} from "react-aria-components"

import {
  dateFieldLabelClasses,
  dateInputClasses,
  dateSegmentClasses,
} from "@nhic/currantui/components/date-field"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components"

/**
 * Segmented, keyboard-editable time input. Pass `label` (or `aria-label`)
 * for the accessible name; values come from `@nhic/currantui/lib/date`.
 */
function TimeField<T extends TimeValue>({
  label,
  description,
  className,
  ...props
}: Omit<AriaTimeFieldProps<T>, "className"> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <AriaTimeField
      data-slot="time-field"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel data-slot="time-field-label" className={dateFieldLabelClasses}>
          {label}
        </AriaLabel>
      )}
      <AriaDateInput data-slot="time-field-input" className={dateInputClasses}>
        {(segment) => (
          <DateSegment
            data-slot="time-field-segment"
            segment={segment}
            className={dateSegmentClasses}
          />
        )}
      </AriaDateInput>
      {description != null && (
        <AriaText
          data-slot="time-field-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
    </AriaTimeField>
  )
}

export { TimeField }
