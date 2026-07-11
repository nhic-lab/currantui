import { withThemeByClassName } from "@storybook/addon-themes"

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

const preview: Preview = {
  decorators: [
    // Class applied to <html>, matching the @custom-variant dark selector;
    // dark is the default because NHIC products are designed dark-first
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "dark",
    }),
    withDirection,
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
    options: {
      storySort: {
        order: [
          "Foundation",
          ["Getting Started", "Colors", "Typography", "Design Standards"],
          "Components",
        ],
      },
    },
  },
  tags: ["autodocs"],
}

export default preview
