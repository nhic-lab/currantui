import * as React from "react"

import { CaretUpDownIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@nhic/currantui/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nhic/currantui/components/popover"

interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Searchable single-select. For long or unfamiliar option lists — plain
 * Select stays the default for short known lists. Async loading and
 * multi-select stay app-side compositions of Popover + Command.
 */
function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  filter,
  shouldFilter,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange"> & {
  options: Array<ComboboxOption>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: React.ReactNode
  filter?: React.ComponentProps<typeof Command>["filter"]
  shouldFilter?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const value = valueProp ?? internal
  const selected = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          data-slot="combobox-trigger"
          data-placeholder={selected ? undefined : ""}
          className={cn(
            "flex h-7 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            className
          )}
          {...props}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <CaretUpDownIcon className="pointer-events-none size-3.5 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label={placeholder}
        className="w-(--radix-popover-trigger-width) min-w-40 gap-0 p-0"
      >
        <Command
          label={searchPlaceholder}
          filter={filter}
          shouldFilter={shouldFilter}
          className="rounded-lg bg-transparent"
        >
          <CommandInput
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  data-checked={option.value === value}
                  onSelect={() => {
                    setInternal(option.value)
                    onValueChange?.(option.value)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export type { ComboboxOption }
