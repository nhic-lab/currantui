import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastRegion as AriaToastRegion,
  Text,
  UNSTABLE_ToastQueue as ToastQueue,
} from "react-aria-components"
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react"

import { Button } from "@nhic/currantui/components/button"
import { ProgressCircle } from "@nhic/currantui/components/progress-circle"
import { cn } from "@nhic/currantui/lib/utils"

import type { QueuedToast } from "react-aria-components"

type ToastVariant = "neutral" | "info" | "success" | "warning" | "error" | "loading"
type ToastSize = "default" | "lg"

interface ToastActionConfig {
  label: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

interface ToastContentValue {
  variant: ToastVariant
  title: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionConfig
  size?: ToastSize
}

/** Options accepted by every `toast.*` call */
interface ToastData {
  description?: React.ReactNode
  action?: ToastActionConfig
  /** `lg` widens the shell and relaxes the description clamp for long copy */
  size?: ToastSize
  /** Auto-dismiss delay in ms; `Infinity` pins the toast. Actionable and loading toasts never auto-dismiss. */
  duration?: number
  /** Key of an existing toast to replace (e.g. resolve a `toast.loading`) */
  id?: string
  onClose?: () => void
}

const TOAST_VARIANTS: Record<
  ToastVariant,
  { icon?: typeof InfoIcon; className: string; spin?: boolean; neutralInk?: boolean }
> = {
  neutral: {
    className: "bg-popover text-popover-foreground ring-1 ring-foreground/10 backdrop-blur-xl",
    neutralInk: true,
  },
  info: { icon: InfoIcon, className: "bg-info text-background" },
  success: { icon: CheckCircleIcon, className: "bg-success text-background" },
  warning: { icon: WarningIcon, className: "bg-warning text-background" },
  error: { icon: XCircleIcon, className: "bg-destructive text-background" },
  // Neutral inverted fill while work is in flight
  loading: { className: "bg-foreground text-background", spin: true },
}

/* Accessible minimum: react-aria guidance is ≥5s for auto-dismiss, and toasts
   carrying an action (or in-flight work) must wait for the user. */
const DEFAULT_TIMEOUT = 5000

const queue = new ToastQueue<ToastContentValue>({ maxVisibleToasts: 3 })

function push(variant: ToastVariant) {
  return (title: React.ReactNode, data: ToastData = {}): string => {
    if (data.id != null) queue.close(data.id)
    const timeout =
      data.action != null || variant === "loading" || data.duration === Infinity
        ? undefined
        : (data.duration ?? DEFAULT_TIMEOUT)
    return queue.add(
      {
        variant,
        title,
        description: data.description,
        action: data.action,
        size: data.size,
      },
      { timeout, onClose: data.onClose }
    )
  }
}

/* toast() is the neutral glass toast; toast.info/success/warning/error render
   solid status fills and toast.loading pins an inverted in-flight fill.
   Passing `id` replaces that toast (resolving a loading toast into a result
   keeps one visual slot). */
const toast = Object.assign(push("neutral"), {
  info: push("info"),
  success: push("success"),
  warning: push("warning"),
  error: push("error"),
  loading: (title: React.ReactNode, data: ToastData = {}) =>
    push("loading")(title, { ...data, duration: data.duration ?? Infinity }),
  dismiss: (id?: string) => {
    if (id != null) queue.close(id)
    else queue.clear()
  },
})

function ToastCard({ item }: { item: QueuedToast<ToastContentValue> }) {
  const { variant, title, description, action, size = "default" } = item.content
  const { icon: Icon, className, spin, neutralInk } = TOAST_VARIANTS[variant]

  return (
    <AriaToast
      toast={item}
      data-slot="toast"
      data-variant={variant}
      data-size={size}
      className={cn(
        "pointer-events-auto flex flex-col rounded-2xl p-3 shadow-lg outline-none animate-in fade-in slide-in-from-bottom-2 focus-visible:ring-2",
        neutralInk ? "focus-visible:ring-ring/30" : "focus-visible:ring-background/40",
        size === "lg" ? "w-[36rem] max-w-[calc(100vw-2rem)]" : "w-89",
        className
      )}
    >
      <div className="flex items-start gap-2">
        {spin ? (
          <ProgressCircle
            aria-hidden="true"
            size="sm"
            className="mt-[3px] shrink-0 text-current"
          />
        ) : (
          Icon != null && (
            <Icon aria-hidden="true" className="mt-[3px] size-4 shrink-0" />
          )
        )}
        <AriaToastContent className="flex min-w-0 flex-1 flex-col">
          <Text slot="title" className="text-sm/relaxed font-medium">
            {title}
          </Text>
          {description != null && (
            <Text
              slot="description"
              className={cn(
                "text-sm/relaxed",
                neutralInk && "text-muted-foreground",
                size === "lg" ? "line-clamp-6" : "line-clamp-3"
              )}
            >
              {description}
            </Text>
          )}
        </AriaToastContent>
        <Button
          variant="ghost"
          size="icon-sm"
          data-slot="toast-close"
          aria-label="Close"
          onClick={() => queue.close(item.key)}
          className={cn(
            "self-start",
            !neutralInk &&
              "text-background hover:bg-background/10 hover:text-background focus-visible:border-background focus-visible:ring-background/40 dark:hover:bg-background/10"
          )}
        >
          <XIcon />
        </Button>
      </div>
      {action != null && (
        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            size="sm"
            data-slot="toast-action"
            onClick={(event) => {
              action.onClick(event)
              queue.close(item.key)
            }}
            className={cn(
              !neutralInk &&
                "border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background focus-visible:border-background focus-visible:ring-background/40 dark:bg-transparent"
            )}
          >
            {action.label}
          </Button>
        </div>
      )}
    </AriaToast>
  )
}

/* Every mounted region renders EVERY queued toast — pages that mount several
   Toasters (each story canvas on a docs page, nested app layouts) get one
   stacked duplicate per instance. Keep a registry so only the
   earliest-mounted Toaster renders; the next in line promotes when it
   unmounts. */
const toasterRegistry: Array<symbol> = []
const toasterListeners = new Set<() => void>()

function useIsPrimaryToaster(): boolean {
  const idRef = useRef<symbol | null>(null)
  idRef.current ??= Symbol("toaster")
  const [isPrimary, setIsPrimary] = useState(false)

  useEffect(() => {
    const id = idRef.current as symbol
    toasterRegistry.push(id)
    const update = () => setIsPrimary(toasterRegistry[0] === id)
    toasterListeners.add(update)
    toasterListeners.forEach((listener) => listener())
    return () => {
      toasterRegistry.splice(toasterRegistry.indexOf(id), 1)
      toasterListeners.delete(update)
      toasterListeners.forEach((listener) => listener())
    }
  }, [])

  return isPrimary
}

/* Toast landmark region: fixed to the viewport's bottom end, newest toast
   nearest the corner, timers pause while hovered or focused (react-aria).
   Portaled to <body> so a transformed ancestor (docs pages, animated panels)
   cannot turn position:fixed into a local overflow — and rendering only
   after mount keeps the portal SSR-safe. */
function Toaster({ className }: { className?: string }) {
  const isPrimary = useIsPrimaryToaster()
  if (!isPrimary) return null

  return createPortal(
    <AriaToastRegion
      aria-label="Notifications"
      queue={queue}
      data-slot="toaster"
      className={cn(
        "fixed end-4 bottom-4 z-50 flex flex-col gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        className
      )}
    >
      {({ toast: item }) => <ToastCard item={item} />}
    </AriaToastRegion>,
    document.body
  )
}

export { Toaster, toast }
