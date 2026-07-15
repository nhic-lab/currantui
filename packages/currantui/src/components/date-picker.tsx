import * as React from "react"
import {
  Button as AriaButton,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Label as AriaLabel,
  Popover as AriaPopover,
  Text as AriaText,
  DateSegment,
} from "react-aria-components"

import { CalendarBlankIcon } from "@phosphor-icons/react"
import { Calendar } from "@nhic/currantui/components/calendar"
import {
  dateFieldLabelClasses,
  dateInputClasses,
  dateSegmentClasses,
} from "@nhic/currantui/components/date-field"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from "react-aria-components"

/* Same glass surface as the Radix popover, keyed to this library's
   entering/exiting + placement data attributes */
const pickerPopoverClasses =
  "relative z-50 rounded-lg bg-popover/70 p-3 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95 data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=top]:slide-in-from-bottom-2"

const pickerButtonClasses =
  "flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors data-[hovered]:bg-muted data-[hovered]:text-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0"

function DatePicker<T extends DateValue>({
  label,
  description,
  className,
  ...props
}: Omit<AriaDatePickerProps<T>, "className"> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <AriaDatePicker
      data-slot="date-picker"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel
          data-slot="date-picker-label"
          className={dateFieldLabelClasses}
        >
          {label}
        </AriaLabel>
      )}
      <AriaGroup
        data-slot="date-picker-group"
        className={cn(dateInputClasses, "justify-between gap-1 pe-1")}
      >
        <AriaDateInput
          data-slot="date-picker-input"
          className="flex items-center"
        >
          {(segment) => (
            <DateSegment segment={segment} className={dateSegmentClasses} />
          )}
        </AriaDateInput>
        <AriaButton data-slot="date-picker-button" className={pickerButtonClasses}>
          <CalendarBlankIcon />
        </AriaButton>
      </AriaGroup>
      {description != null && (
        <AriaText
          data-slot="date-picker-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
      <AriaPopover
        data-slot="date-picker-popover"
        placement="bottom start"
        className={pickerPopoverClasses}
      >
        <AriaDialog data-slot="date-picker-dialog" className="outline-hidden">
          <Calendar />
        </AriaDialog>
      </AriaPopover>
    </AriaDatePicker>
  )
}

export { DatePicker, pickerButtonClasses, pickerPopoverClasses }
