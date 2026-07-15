---
"@nhic/currantui": minor
---

Date and time foundation (adds `react-aria-components` + `@internationalized/date`, both Apache-2.0):

- `@nhic/currantui/lib/date` — the sanctioned import point for date/time value types (`CalendarDate`, `Time`, `parseDate`, `today`, …) so consumers never install a second copy of the underlying library.
- `Calendar` and `RangeCalendar` — month grids at house density (size-7 cells, tabular numerals, today ring), with min/max and unavailable-date support; the range selection renders as one continuous bar.
- `DateField` and `TimeField` — segmented, keyboard-editable inputs on the standard field chrome, with optional built-in label and description, invalid/disabled states, hour-cycle and granularity options.
