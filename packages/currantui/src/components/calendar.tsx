import * as React from "react"
import { getLocalTimeZone, isToday } from "@internationalized/date"
import {
  Button as AriaButton,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components"

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"
import type {
  CalendarProps as AriaCalendarProps,
  DateValue,
} from "react-aria-components"

const calendarCellBaseClasses =
  "flex size-7 items-center justify-center rounded-md text-xs/relaxed tabular-nums outline-none data-[hovered]:bg-accent data-[hovered]:text-accent-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[unavailable]:line-through data-[unavailable]:opacity-50 data-[outside-month]:hidden"

const calendarNavButtonClasses =
  "flex size-7 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors data-[hovered]:bg-muted data-[hovered]:text-foreground data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-30 [&_svg]:size-3.5 [&_svg]:shrink-0"

const calendarHeaderCellClasses =
  "size-7 text-[0.625rem] font-medium text-muted-foreground"

function CalendarHeader() {
  return (
    <div
      data-slot="calendar-header"
      className="flex items-center justify-between gap-1"
    >
      <AriaButton slot="previous" className={calendarNavButtonClasses}>
        <CaretLeftIcon className="rtl:rotate-180" />
      </AriaButton>
      <Heading
        data-slot="calendar-heading"
        className="text-xs/relaxed font-medium"
      />
      <AriaButton slot="next" className={calendarNavButtonClasses}>
        <CaretRightIcon className="rtl:rotate-180" />
      </AriaButton>
    </div>
  )
}

function Calendar<T extends DateValue>({
  className,
  ...props
}: Omit<AriaCalendarProps<T>, "className"> & { className?: string }) {
  return (
    <AriaCalendar
      data-slot="calendar"
      className={cn("w-fit", className)}
      {...props}
    >
      <CalendarHeader />
      <CalendarGrid className="mt-2 border-separate border-spacing-0.5">
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
                "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
                isToday(date, getLocalTimeZone()) &&
                  "border border-primary/40"
              )}
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </AriaCalendar>
  )
}

export {
  Calendar,
  CalendarHeader,
  calendarCellBaseClasses,
  calendarHeaderCellClasses,
  calendarNavButtonClasses,
}
