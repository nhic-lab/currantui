import { GLOBALS_UPDATED, SET_GLOBALS } from "storybook/internal/core-events"
import { addons } from "storybook/manager-api"

import { nhicDark, nhicLight } from "./nhic-theme"

import type { TagBadgeParameters } from "storybook-addon-tag-badges"

const tagBadges: TagBadgeParameters = [
  {
    tags: "new",
    badge: {
      text: "New",
      style: { backgroundColor: "#0175AC", color: "#fafafa" },
      tooltip: "Recently added — API may still move",
    },
    display: {
      sidebar: [{ type: "component", skipInherited: true }],
      toolbar: true,
    },
  },
  {
    tags: "beta",
    badge: {
      text: "Beta",
      style: { backgroundColor: "#78350f", color: "#fef3c7" },
      tooltip: "Not yet stable — expect changes",
    },
    display: {
      sidebar: [{ type: "component", skipInherited: true }],
      toolbar: true,
    },
  },
  {
    tags: "deprecated",
    badge: {
      text: "Deprecated",
      style: { backgroundColor: "#7f1d1d", color: "#fecaca" },
      tooltip: "Scheduled for removal — do not adopt",
    },
    display: {
      sidebar: [{ type: "component", skipInherited: true }],
      toolbar: true,
    },
  },
]

addons.setConfig({
  theme: nhicDark,
  tagBadges,
})

/* Follow the preview theme global (driven by the toolbar or by in-story
   ThemeToggle clicks via the withThemeSync decorator) so the whole manager
   shell — sidebar, toolbar, panels — switches with it */
addons.register("nhic/manager-theme-sync", (api) => {
  let current: string | undefined
  const apply = (payload: {
    globals?: { theme?: string }
    userGlobals?: { theme?: string }
  }) => {
    const theme = payload.globals?.theme ?? payload.userGlobals?.theme
    if (!theme || theme === current) return
    current = theme
    api.setOptions({ theme: theme === "light" ? nhicLight : nhicDark })
  }
  api.on(SET_GLOBALS, apply)
  api.on(GLOBALS_UPDATED, apply)
})
