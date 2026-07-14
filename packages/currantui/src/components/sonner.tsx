import { useEffect, useState } from "react"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"
import {
  CheckCircleIcon,
  InfoIcon,
  SpinnerIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react"
import { cn } from "@nhic/currantui/lib/utils"
import type { ExternalToast, ToasterProps } from "sonner"

/* This app themes via a `dark` class on <html> (see theme-toggle + the pre-paint script
   in __root), not next-themes — so mirror that class instead of useTheme(). Colours come
   from the design tokens wired into the `style` block below. */
function useDocumentTheme(): ToasterProps["theme"] {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  useEffect(() => {
    const el = document.documentElement
    const read = () => setTheme(el.classList.contains("dark") ? "dark" : "light")
    read()
    const obs = new MutationObserver(read)
    obs.observe(el, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return theme
}

type StatusVariant = "info" | "success" | "warning" | "error" | "loading"

const STATUS_TOAST: Record<
  StatusVariant,
  { icon: typeof InfoIcon; className: string; spin?: boolean }
> = {
  info: { icon: InfoIcon, className: "bg-info" },
  success: { icon: CheckCircleIcon, className: "bg-success" },
  warning: { icon: WarningIcon, className: "bg-warning" },
  error: { icon: XCircleIcon, className: "bg-destructive" },
  // Spectrum-neutral inverted fill while work is in flight
  loading: { icon: SpinnerIcon, className: "bg-foreground", spin: true },
}

function isActionObject(
  action: unknown
): action is { label: React.ReactNode; onClick: (event: React.MouseEvent<HTMLButtonElement>) => void } {
  return (
    typeof action === "object" &&
    action !== null &&
    "label" in action &&
    "onClick" in action
  )
}

/* React Spectrum Toast anatomy on house tokens: solid status fill, filled
   icon, single-row content, outlined action button, divider, close button.
   The ink is --background — white on the deep fills in light, near-black on
   the bright fills in dark; both AA-checked pairings. */
function StatusToast({
  id,
  variant,
  title,
  description,
  action,
}: {
  id: string | number
  variant: StatusVariant
  title: React.ReactNode
  description?: React.ReactNode
  action?: ExternalToast["action"]
}) {
  const { icon: Icon, className, spin } = STATUS_TOAST[variant]

  return (
    <div
      data-slot="toast"
      data-variant={variant}
      className={cn(
        "pointer-events-auto flex w-89 items-center gap-2 rounded-lg p-2 ps-3 text-background shadow-lg",
        className
      )}
    >
      <Icon
        weight={spin ? "regular" : "fill"}
        aria-hidden="true"
        className={cn("size-4 shrink-0", spin && "animate-spin")}
      />
      <div className="flex min-w-0 flex-1 flex-col py-0.5 text-xs/relaxed">
        <p data-slot="toast-title" className="font-medium">
          {title}
        </p>
        {description != null && (
          <p data-slot="toast-description" className="text-background/85">
            {description}
          </p>
        )}
      </div>
      {isActionObject(action) ? (
        <button
          type="button"
          data-slot="toast-action"
          onClick={(event) => {
            action.onClick(event)
            sonnerToast.dismiss(id)
          }}
          className="h-6 shrink-0 rounded-md border border-background/40 px-2 text-[0.625rem] font-medium whitespace-nowrap transition-colors outline-none hover:bg-background/10 focus-visible:border-background focus-visible:ring-2 focus-visible:ring-background/40"
        >
          {action.label}
        </button>
      ) : (
        (action)
      )}
      <span aria-hidden="true" className="h-6 w-px shrink-0 bg-background/25" />
      <button
        type="button"
        data-slot="toast-close"
        aria-label="Close"
        onClick={() => sonnerToast.dismiss(id)}
        className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors outline-none hover:bg-background/10 focus-visible:border-background focus-visible:ring-2 focus-visible:ring-background/40 [&_svg]:size-3.5 [&_svg]:shrink-0"
      >
        <XIcon />
      </button>
    </div>
  )
}

function statusToast(variant: StatusVariant) {
  return (
    title: Parameters<typeof sonnerToast>[0],
    data: Parameters<typeof sonnerToast>[1] = {}
  ) =>
    sonnerToast.custom(
      (id) => (
        <StatusToast
          id={id}
          variant={variant}
          title={typeof title === "function" ? title() : title}
          description={
            typeof data.description === "function"
              ? data.description()
              : data.description
          }
          action={data.action}
        />
      ),
      {
        // duration/position intentionally pass through even when undefined —
        // on an update the explicit undefined clears the previous toast's
        // values (a leftover Infinity duration would never dismiss)
        duration: data.duration,
        position: data.position,
        // When updating a toast.loading toast by id, sonner's merge keeps the
        // old type and icon: type "loading" disables the dismiss timer and
        // dismissibility and keeps loader visuals alive over the custom
        // render, so reset both explicitly (type passes through create() but
        // is absent from ExternalToast, hence the cast)
        icon: null,
        type: "default",
        // Never spread id: undefined — sonner's custom() computes an id and
        // spreads this object after it, so an explicit undefined makes
        // create() mint a second id and the returned id stops targeting the
        // stored toast (updates then duplicate instead of replacing)
        ...(data.id != null ? { id: data.id } : {}),
      } as ExternalToast
    )
}

/* Drop-in sonner API with Spectrum-styled status toasts: toast() stays the
   neutral glass toast; toast.info/success/warning/error/loading render
   StatusToast. loading is custom too so updating it by id swaps content
   inside one consistent shell instead of jumping between sonner chrome and
   the custom render. */
const toast: typeof sonnerToast = Object.assign(
  ((...args: Parameters<typeof sonnerToast>) =>
    sonnerToast(...args)) as typeof sonnerToast,
  sonnerToast,
  {
    info: statusToast("info"),
    success: statusToast("success"),
    warning: statusToast("warning"),
    error: statusToast("error"),
    loading: (
      title: Parameters<typeof sonnerToast>[0],
      data: Parameters<typeof sonnerToast>[1] = {}
    ) => statusToast("loading")(title, { duration: Infinity, ...data }),
  }
)

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDocumentTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        // toast.success/error are custom-rendered; these still serve toast.promise
        success: <CheckCircleIcon className="size-4 text-success" />,
        error: <XCircleIcon className="size-4 text-destructive" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        loading: <SpinnerIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        // Glass treatment matching SelectContent, self-guarded to sonner-styled
        // toasts — custom StatusToasts (data-styled=false) own their chrome
        classNames: {
          toast:
            "text-xs data-[styled=true]:ring-1 data-[styled=true]:ring-foreground/10 data-[styled=true]:shadow-md data-[styled=true]:backdrop-blur-xl",
          description: "text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
