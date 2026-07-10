import { useEffect, useState } from "react"
import { Toaster as Sonner,  toast } from "sonner"
import { CheckCircleIcon, InfoIcon, SpinnerIcon, WarningIcon, XCircleIcon } from "@phosphor-icons/react"
import type {ToasterProps} from "sonner";

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

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useDocumentTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4 text-primary" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4 text-destructive" />,
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
        // Glass treatment matching SelectContent (cn-toast isn't shipped to this repo).
        classNames: {
          toast: "ring-1 ring-foreground/10 shadow-md backdrop-blur-xl text-xs",
          description: "text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
