import { withThemeByClassName } from "@storybook/addon-themes"
import { useEffect, useGlobals } from "storybook/preview-api"

import { NhicDocsContainer } from "./docs-container"

import "./preview.css"

import type { Decorator, Preview } from "@storybook/react-vite"

const withDirection: Decorator = (Story, context) => {
  const dir = (context.globals.direction ?? "ltr") as "ltr" | "rtl"
  document.documentElement.setAttribute("dir", dir)
  return (
    <div dir={dir}>
      <Story />
    </div>
  )
}

/* Components like ThemeToggle flip the dark class on <html> directly;
   mirror that back into the theme global so the toolbar, the manager, and
   every other story follow the in-story toggle. Top-frame story view only:
   `viewMode === "story"` alone isn't enough — addon-docs renders each
   `inline: false` story as its own standalone preview iframe, which also
   has viewMode "story". Running there closes a loop: the theme decorator
   applies the class, this observer sees that mutation and calls
   updateGlobals, which forces that nested iframe to re-render and reapply
   the class, re-triggering the observer forever. `window.top === window.self`
   excludes any frame embedded inside another (docs-embedded previews,
   composed/nested stories) — only the frame the user is directly viewing. */
const withThemeSync: Decorator = (Story, context) => {
  const [globals, updateGlobals] = useGlobals()
  const enabled = context.viewMode === "story" && window.top === window.self
  useEffect(() => {
    if (!enabled) return
    const el = document.documentElement
    const observer = new MutationObserver(() => {
      const next = el.classList.contains("dark") ? "dark" : "light"
      if ((globals.theme ?? "dark") !== next) updateGlobals({ theme: next })
    })
    observer.observe(el, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  })
  return <Story />
}

const preview: Preview = {
  decorators: [
    // Class applied to <html>, matching the @custom-variant dark selector;
    // dark is the default because NHIC products are designed dark-first
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "dark",
    }),
    withDirection,
    withThemeSync,
  ],
  globalTypes: {
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "ltr", title: "LTR" },
          { value: "rtl", title: "RTL" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { direction: "ltr" },
  parameters: {
    a11y: { test: "error" },
    backgrounds: { disable: true },
    docs: {
      container: NhicDocsContainer,
      // "Show code" renders the story's actual JSX (args resolved, play
      // functions and story-object chrome stripped) instead of the raw CSF
      // source. Stateful demos wrapped in a local component override this
      // per-story with docs.source.code.
      source: {
        type: "dynamic",
        excludeDecorators: true,
        // Date/time values serialize via toString ({2026-03-14}, {18:00}) —
        // rewrite them to the @nhic/currantui/lib/date parse calls so the
        // snippet is valid, runnable code
        transform: (code: string) =>
          code
            .replace(/<React\.Fragment(?:\s+key="[^"]*")?\s*>/g, "<>")
            .replace(/<\/React\.Fragment>/g, "</>")
            .replace(
              /=\{(\d{4}-\d{2}-\d{2}T[^}]+)\}/g,
              '={parseDateTime("$1")}'
            )
            .replace(/=\{(\d{4}-\d{2}-\d{2})\}/g, '={parseDate("$1")}')
            .replace(
              /=\{(\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)\}/g,
              '={parseTime("$1")}'
            ),
      },
    },
    viewport: {
      options: {
        mobile: {
          name: "Mobile",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
        tablet: {
          name: "Tablet",
          styles: { width: "820px", height: "1180px" },
          type: "tablet",
        },
        laptop: {
          name: "Laptop",
          styles: { width: "1440px", height: "900px" },
          type: "desktop",
        },
        workstation: {
          name: "Workstation",
          styles: { width: "1920px", height: "1080px" },
          type: "desktop",
        },
      },
    },
    options: {
      storySort: {
        order: [
          "Welcome",
          "Foundation",
          ["Getting Started", "Colors", "Typography", "Design Standards", "Shell", "Component Index"],
          "Components",
          "Charts",
          ["Overview"],
        ],
      },
    },
  },
  tags: ["autodocs"],
}

export default preview
