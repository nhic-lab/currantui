import * as React from "react"
import {
  Button as AriaButton,
  DateInput as AriaDateInput,
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Label as AriaLabel,
  Popover as AriaPopover,
  Text as AriaText,
  DateSegment,
} from "react-aria-components"

import { CalendarBlankIcon } from "@phosphor-icons/react"
import {
  pickerButtonClasses,
  pickerPopoverClasses,
} from "@nhic/currantui/components/date-picker"
import {
  dateFieldLabelClasses,
  dateInputClasses,
  dateSegmentClasses,
} from "@nhic/currantui/components/date-field"
import { RangeCalendar } from "@nhic/currantui/components/range-calendar"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  DateRangePickerProps as AriaDateRangePickerProps,
  DateValue,
} from "react-aria-components"

function DateRangePicker<T extends DateValue>({
  label,
  description,
  className,
  ...props
}: Omit<AriaDateRangePickerProps<T>, "className"> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <AriaDateRangePicker
      data-slot="date-range-picker"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel
          data-slot="date-range-picker-label"
          className={dateFieldLabelClasses}
        >
          {label}
        </AriaLabel>
      )}
      <AriaGroup
        data-slot="date-range-picker-group"
        className={cn(dateInputClasses, "justify-between gap-1 pe-1")}
      >
        <div className="flex items-center gap-1">
          <AriaDateInput
            data-slot="date-range-picker-start"
            slot="start"
            className="flex items-center"
          >
            {(segment) => (
              <DateSegment segment={segment} className={dateSegmentClasses} />
            )}
          </AriaDateInput>
          <span aria-hidden="true" className="px-0.5 text-muted-foreground">
            –
          </span>
          <AriaDateInput
            data-slot="date-range-picker-end"
            slot="end"
            className="flex items-center"
          >
            {(segment) => (
              <DateSegment segment={segment} className={dateSegmentClasses} />
            )}
          </AriaDateInput>
        </div>
        <AriaButton
          data-slot="date-range-picker-button"
          className={pickerButtonClasses}
        >
          <CalendarBlankIcon />
        </AriaButton>
      </AriaGroup>
      {description != null && (
        <AriaText
          data-slot="date-range-picker-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
      <AriaPopover
        data-slot="date-range-picker-popover"
        placement="bottom start"
        className={pickerPopoverClasses}
      >
        <AriaDialog
          data-slot="date-range-picker-dialog"
          className="outline-hidden"
        >
          <RangeCalendar />
        </AriaDialog>
      </AriaPopover>
    </AriaDateRangePicker>
  )
}

export { DateRangePicker }
