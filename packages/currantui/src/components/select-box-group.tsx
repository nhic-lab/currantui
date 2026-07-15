import * as React from "react"
import {
  Checkbox as CheckboxPrimitive,
  RadioGroup as RadioGroupPrimitive,
} from "radix-ui"

import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"

type SelectBoxGroupContextValue = {
  type: "single" | "multiple"
  values: Array<string>
  toggle: (value: string) => void
}

const SelectBoxGroupContext =
  React.createContext<SelectBoxGroupContextValue | null>(null)

function useSelectBoxGroup() {
  const context = React.useContext(SelectBoxGroupContext)
  if (!context) {
    throw new Error("SelectBoxGroupItem must be used within SelectBoxGroup")
  }
  return context
}

type SelectBoxGroupSingleProps = {
  type?: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type SelectBoxGroupMultipleProps = {
  type: "multiple"
  value?: Array<string>
  defaultValue?: Array<string>
  onValueChange?: (value: Array<string>) => void
}

/**
 * Selectable cards for choices that carry a title, description, or icon —
 * richer than a radio/checkbox row. `type="single"` keeps radio semantics,
 * `type="multiple"` checkbox semantics; needs an accessible name via
 * `aria-label`/`aria-labelledby`.
 */
function SelectBoxGroup({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> &
  (SelectBoxGroupSingleProps | SelectBoxGroupMultipleProps)) {
  const [internalValues, setInternalValues] = React.useState<Array<string>>(
    (defaultValue as Array<string> | undefined) ?? []
  )
  const groupClasses = cn("grid gap-3", className)

  if (type === "single") {
    return (
      <SelectBoxGroupContext.Provider
        value={{ type, values: [], toggle: () => {} }}
      >
        <RadioGroupPrimitive.Root
          data-slot="select-box-group"
          value={value as string | undefined}
          defaultValue={defaultValue as string | undefined}
          onValueChange={onValueChange as (value: string) => void}
          className={groupClasses}
          {...props}
        />
      </SelectBoxGroupContext.Provider>
    )
  }

  const values = (value as Array<string> | undefined) ?? internalValues
  const toggle = (item: string) => {
    const next = values.includes(item)
      ? values.filter((v) => v !== item)
      : [...values, item]
    if (value === undefined) setInternalValues(next)
    ;(onValueChange as ((value: Array<string>) => void) | undefined)?.(next)
  }

  return (
    <SelectBoxGroupContext.Provider value={{ type, values, toggle }}>
      <div
        role="group"
        data-slot="select-box-group"
        className={groupClasses}
        {...props}
      />
    </SelectBoxGroupContext.Provider>
  )
}

const selectBoxItemClasses =
  "group/select-box relative flex flex-col items-start gap-0.5 rounded-lg border p-3 pe-9 text-start text-xs/relaxed transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-checked:border-primary data-checked:bg-primary/5 data-checked:hover:bg-primary/5 [&_svg]:pointer-events-none [&_svg]:shrink-0"

function SelectBoxGroupItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const group = useSelectBoxGroup()

  const content = (
    <>
      {children}
      <span
        aria-hidden="true"
        data-slot="select-box-group-indicator"
        className="absolute top-2.5 end-2.5 hidden size-4 items-center justify-center rounded-full bg-primary text-primary-foreground group-data-checked/select-box:inline-flex"
      >
        <CheckIcon className="size-3" />
      </span>
    </>
  )

  if (group.type === "single") {
    return (
      <RadioGroupPrimitive.Item
        data-slot="select-box-group-item"
        value={value}
        className={cn(selectBoxItemClasses, className)}
        {...props}
      >
        {content}
      </RadioGroupPrimitive.Item>
    )
  }

  return (
    <CheckboxPrimitive.Root
      data-slot="select-box-group-item"
      checked={group.values.includes(value)}
      onCheckedChange={() => group.toggle(value)}
      className={cn(selectBoxItemClasses, className)}
      {...props}
    >
      {content}
    </CheckboxPrimitive.Root>
  )
}

function SelectBoxGroupItemTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="select-box-group-item-title"
      className={cn(
        "flex items-center gap-1.5 font-medium text-foreground [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function SelectBoxGroupItemDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="select-box-group-item-description"
      className={cn(
        /* muted-foreground misses AA on the checked primary tint in light mode */
        "block text-muted-foreground group-data-checked/select-box:text-foreground/70",
        className
      )}
      {...props}
    />
  )
}

export {
  SelectBoxGroup,
  SelectBoxGroupItem,
  SelectBoxGroupItemTitle,
  SelectBoxGroupItemDescription,
}
