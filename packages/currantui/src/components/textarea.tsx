import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@nhic/currantui/lib/utils"

import type { VariantProps } from "class-variance-authority"

const textareaVariants = cva(
  "flex field-sizing-content w-full resize-none rounded-md border border-input bg-input/20 px-2 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:leading-relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "min-h-9 max-h-32",
        md: "min-h-14 max-h-48",
        lg: "min-h-24 max-h-72",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function Textarea({
  className,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size }), className)}
      {...props}
    />
  )
}

export { Textarea }
