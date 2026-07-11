interface TokenGroup {
  title: string
  tokens: Array<string>
}

const GROUPS: Array<TokenGroup> = [
  {
    title: "Surfaces",
    tokens: ["background", "card", "popover", "muted", "accent"],
  },
  {
    title: "Text",
    tokens: [
      "foreground",
      "card-foreground",
      "popover-foreground",
      "muted-foreground",
      "accent-foreground",
    ],
  },
  {
    title: "Brand",
    tokens: [
      "primary",
      "primary-deep",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
    ],
  },
  {
    title: "Feedback & lines",
    tokens: ["destructive", "border", "input", "ring"],
  },
  {
    title: "Charts",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
]

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-8 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(--${token})` }}
      />
      <code className="text-xs text-foreground">--{token}</code>
    </div>
  )
}

/* Mirror of the :root light palette in
   packages/currantui/src/styles/globals.css — update together. Pinning the
   values here keeps the Light panel light even while the preview theme
   toolbar has the dark class on <html>. */
const LIGHT_TOKENS: Record<string, string> = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.145 0 0)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.145 0 0)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.145 0 0)",
  "--primary": "oklch(0.52 0.079 222)",
  "--primary-deep": "oklch(0.42 0.10 222)",
  "--primary-foreground": "oklch(0.984 0.019 200.873)",
  "--secondary": "oklch(0.967 0.001 286.375)",
  "--secondary-foreground": "oklch(0.21 0.006 285.885)",
  "--muted": "oklch(0.97 0 0)",
  "--muted-foreground": "oklch(0.556 0 0)",
  "--accent": "oklch(0.97 0 0)",
  "--accent-foreground": "oklch(0.205 0 0)",
  "--destructive": "oklch(0.52 0.245 27.325)",
  "--border": "oklch(0.922 0 0)",
  "--input": "oklch(0.922 0 0)",
  "--ring": "oklch(0.708 0 0)",
  "--chart-1": "oklch(0.87 0 0)",
  "--chart-2": "oklch(0.556 0 0)",
  "--chart-3": "oklch(0.439 0 0)",
  "--chart-4": "oklch(0.371 0 0)",
  "--chart-5": "oklch(0.269 0 0)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.145 0 0)",
  "--sidebar-primary": "oklch(0.609 0.126 221.723)",
  "--sidebar-primary-foreground": "oklch(0.984 0.019 200.873)",
  "--sidebar-accent": "oklch(0.97 0 0)",
  "--sidebar-accent-foreground": "oklch(0.205 0 0)",
  "--sidebar-border": "oklch(0.922 0 0)",
  "--sidebar-ring": "oklch(0.708 0 0)",
}

function TokenGrid() {
  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map((group) => (
        <section key={group.title}>
          <h4 className="mb-2 font-heading text-xs font-semibold text-muted-foreground">
            {group.title}
          </h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {group.tokens.map((token) => (
              <Swatch key={token} token={token} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function PaletteComparison() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div
        style={LIGHT_TOKENS}
        className="rounded-lg border border-border bg-background p-4 text-foreground"
      >
        <h3 className="mb-4 font-heading text-sm font-semibold">Light</h3>
        <TokenGrid />
      </div>
      <div className="dark rounded-lg border border-border bg-background p-4 text-foreground">
        <h3 className="mb-4 font-heading text-sm font-semibold">Dark</h3>
        <TokenGrid />
      </div>
    </div>
  )
}
