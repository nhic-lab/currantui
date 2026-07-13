import * as React from "react"
import { Slot } from "radix-ui"

import { cn } from "@nhic/currantui/lib/utils"

function Link({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "a"

  return (
    <Comp
      data-slot="link"
      className={cn(
        "inline-flex items-center gap-1 rounded-sm text-xs/relaxed text-primary underline-offset-4 transition-colors outline-none hover:underline focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export { Link }
