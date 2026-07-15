import * as React from "react"
import { getLocalTimeZone, isToday } from "@internationalized/date"
import {
  RangeCalendar as AriaRangeCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
} from "react-aria-components"

import {
  CalendarHeader,
  calendarCellBaseClasses,
  calendarHeaderCellClasses,
} from "@nhic/currantui/components/calendar"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  RangeCalendarProps as AriaRangeCalendarProps,
  DateValue,
} from "react-aria-components"

function RangeCalendar<T extends DateValue>({
  className,
  ...props
}: Omit<AriaRangeCalendarProps<T>, "className"> & { className?: string }) {
  return (
    <AriaRangeCalendar
      data-slot="range-calendar"
      className={cn("w-fit", className)}
      {...props}
    >
      <CalendarHeader />
      {/* zero cell spacing so the selected range reads as one continuous bar */}
      <CalendarGrid className="mt-2 border-separate border-spacing-y-0.5 border-spacing-x-0">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className={calendarHeaderCellClasses}>
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className={cn(
                calendarCellBaseClasses,
                "data-[selected]:rounded-none data-[selected]:bg-primary/15",
                "data-[selection-start]:rounded-md data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground",
                "data-[selection-end]:rounded-md data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground",
                "data-[invalid]:data-[selected]:bg-destructive/15",
                isToday(date, getLocalTimeZone()) &&
                  "border border-primary/40"
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaRangeCalendar>
  )
}

export { RangeCalendar }
