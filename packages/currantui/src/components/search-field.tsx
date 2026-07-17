import { MagnifyingGlassIcon } from "@phosphor-icons/react"

import { cn } from "@nhic/currantui/lib/utils"

interface SearchFieldProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  /** Accessible name for the input; defaults to "Search" */
  "aria-label"?: string
  className?: string
  inputClassName?: string
}

export function SearchField({
  value,
  onValueChange,
  placeholder = "Search…",
  "aria-label": ariaLabel = "Search",
  className,
  inputClassName,
}: SearchFieldProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-transparent bg-muted/50 px-2 py-1 transition-all focus-within:border-primary/50 focus-within:bg-background focus-within:ring-1 focus-within:ring-primary/30",
        className,
      )}
    >
      <MagnifyingGlassIcon size={14} className="shrink-0 text-muted-foreground" />
      <input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(
          "w-44 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none",
          inputClassName,
        )}
      />
    </div>
  )
}
