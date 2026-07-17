import * as React from "react"

import { CaretDownIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react"
import { Button } from "@nhic/currantui/components/button"
import { cn } from "@nhic/currantui/lib/utils"

/** Inline code pill for identifiers and short commands inside prose. */
function CodeSnippetInline({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="code-snippet-inline"
      className={cn(
        "rounded-sm bg-muted px-1 py-px font-mono text-xs text-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * Monochrome code block with a copy button; no syntax highlighting (a
 * highlighter is an app concern). `expandable` collapses long content
 * behind a show-more toggle. Copy is skipped silently where the Clipboard
 * API is unavailable (non-secure contexts).
 */
function CodeSnippet({
  children,
  expandable = false,
  hideCopy = false,
  copyLabel = "Copy code",
  expandLabel = "Show more",
  collapseLabel = "Show less",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The code itself, as a string — also what the copy button writes */
  children: string
  expandable?: boolean
  hideCopy?: boolean
  copyLabel?: string
  expandLabel?: string
  collapseLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const resetTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(resetTimer.current), [])

  function copy() {
    /* Clipboard API is missing in non-secure contexts */
    const clipboard = navigator.clipboard as Clipboard | undefined
    if (!clipboard) return
    clipboard
      .writeText(children)
      .then(() => {
        setCopied(true)
        clearTimeout(resetTimer.current)
        resetTimer.current = setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div
      data-slot="code-snippet"
      className={cn(
        "relative rounded-md border bg-muted/50 font-mono text-sm/relaxed",
        className
      )}
      {...props}
    >
      <pre
        data-slot="code-snippet-pre"
        tabIndex={0}
        className={cn(
          "overflow-x-auto p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
          !hideCopy && "pe-10",
          expandable && !expanded && "max-h-40 overflow-y-hidden"
        )}
      >
        <code>{children}</code>
      </pre>
      {!hideCopy && (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={copyLabel}
            onClick={copy}
            className="absolute top-1.5 end-1.5"
          >
            {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
          </Button>
          <span aria-live="polite" className="sr-only">
            {copied ? "Copied to clipboard" : ""}
          </span>
        </>
      )}
      {expandable && (
        <button
          type="button"
          data-slot="code-snippet-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="flex h-7 w-full items-center gap-1 border-t px-3 font-sans text-sm/relaxed text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <CaretDownIcon
            aria-hidden="true"
            className={cn("size-4 transition-transform", expanded && "rotate-180")}
          />
          {expanded ? collapseLabel : expandLabel}
        </button>
      )}
    </div>
  )
}

export { CodeSnippet, CodeSnippetInline }
