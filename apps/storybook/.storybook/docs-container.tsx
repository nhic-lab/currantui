import { useEffect, useState } from "react"
import { DocsContainer } from "@storybook/addon-docs/blocks"
import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events"
import { addons } from "storybook/preview-api"

import { nhicDark, nhicLight } from "./nhic-theme"

import type { ComponentProps } from "react"

type Mode = "dark" | "light"

/* Anything that isn't an explicit "light" is the dark-first default —
   Storybook's boot event carries theme: "" before the toolbar is touched */
const toMode = (theme: string | undefined): Mode =>
  theme === "light" ? "light" : "dark"

const readUrl = (): Mode =>
  new URLSearchParams(window.location.search).get("globals")?.includes("theme:light")
    ? "light"
    : "dark"

/* parameters.docs.theme is static, so docs pages cannot follow the theme
   global on their own — this container re-reads it live from the globals
   channel and owns the dark class on <html> while docs render (pure-MDX
   pages have no story render to apply it) */
export function NhicDocsContainer(props: ComponentProps<typeof DocsContainer>) {
  const [mode, setMode] = useState<Mode>(readUrl)

  useEffect(() => {
    const channel = addons.getChannel()
    const onGlobals = (payload: { globals?: { theme?: string } }) => {
      if (payload.globals && "theme" in payload.globals)
        setMode(toMode(payload.globals.theme))
    }
    channel.on(SET_GLOBALS, onGlobals)
    channel.on(GLOBALS_UPDATED, onGlobals)

    return () => {
      channel.off(SET_GLOBALS, onGlobals)
      channel.off(GLOBALS_UPDATED, onGlobals)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark")
  }, [mode])

  return (
    <DocsContainer
      {...props}
      theme={mode === "light" ? nhicLight : nhicDark}
    />
  )
}
