import * as React from "react"

import { FolderIcon } from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"

const inputClasses =
  "h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:leading-relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  if (type === "file") {
    return (
      <span data-slot="input-wrapper" className="relative inline-flex w-full">
        <FolderIcon
          aria-hidden="true"
          className="pointer-events-none absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="file"
          data-slot="input"
          className={cn(inputClasses, "ps-7", className)}
          {...props}
        />
      </span>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputClasses, className)}
      {...props}
    />
  )
}

export { Input }
