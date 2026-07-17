import * as React from "react"
import {
  Button as AriaButton,
  Group as AriaGroup,
  Input as AriaInput,
  Label as AriaLabel,
  NumberField as AriaNumberField,
  Text as AriaText,
} from "react-aria-components"

import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import {
  dateFieldLabelClasses,
  dateInputClasses,
} from "@nhic/currantui/components/date-field"
import { cn } from "@nhic/currantui/lib/utils"
import type { NumberFieldProps as AriaNumberFieldProps } from "react-aria-components"

const stepperButtonClasses =
  "flex h-1/2 w-5 items-center justify-center text-muted-foreground outline-none transition-colors data-[hovered]:bg-muted data-[hovered]:text-foreground data-[pressed]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-30 [&_svg]:size-2.5 [&_svg]:shrink-0"

/**
 * Locale-aware numeric input with stepper buttons — `formatOptions` covers
 * decimals, percentages, currencies, and units. Pass `label` (or
 * `aria-label`) for the accessible name.
 */
function NumberField({
  label,
  description,
  className,
  ...props
}: Omit<AriaNumberFieldProps, "className"> & {
  className?: string
  label?: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <AriaNumberField
      data-slot="number-field"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label != null && (
        <AriaLabel
          data-slot="number-field-label"
          className={dateFieldLabelClasses}
        >
          {label}
        </AriaLabel>
      )}
      <AriaGroup
        data-slot="number-field-group"
        className={cn(dateInputClasses, "gap-0 overflow-hidden p-0")}
      >
        <AriaInput
          data-slot="number-field-input"
          className="h-full w-full min-w-0 bg-transparent px-2 text-sm/relaxed outline-none placeholder:text-muted-foreground tabular-nums"
        />
        <div
          data-slot="number-field-steppers"
          className="flex h-full shrink-0 flex-col border-s border-input"
        >
          <AriaButton slot="increment" className={stepperButtonClasses}>
            <CaretUpIcon />
          </AriaButton>
          <AriaButton
            slot="decrement"
            className={cn(stepperButtonClasses, "border-t border-input")}
          >
            <CaretDownIcon />
          </AriaButton>
        </div>
      </AriaGroup>
      {description != null && (
        <AriaText
          data-slot="number-field-description"
          slot="description"
          className="text-xs/relaxed text-muted-foreground"
        >
          {description}
        </AriaText>
      )}
    </AriaNumberField>
  )
}

export { NumberField }
