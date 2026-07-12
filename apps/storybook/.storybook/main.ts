import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import remarkGfm from "remark-gfm"

import type { StorybookConfig } from "@storybook/react-vite"

const here = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  // The packages/* glob picks up future packages (charts) with no config change
  stories: [
    "../docs/**/*.mdx",
    "../recipes/**/*.stories.@(tsx|mdx)",
    "../../../packages/*/src/**/*.stories.@(tsx|mdx)",
  ],
  addons: [
    {
      name: "@storybook/addon-docs",
      options: {
        // GFM tables in MDX need remark-gfm since Storybook 8
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "storybook-addon-tag-badges",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Serves logo.svg at "/logo.svg" (HicLogo default src + favicon), the
  // brand lockup, and the variable font for the manager UI
  staticDirs: [
    "../../../packages/currantui/src/assets",
    "../public",
    {
      from: "../../../node_modules/@fontsource-variable/source-sans-3/files",
      to: "/fonts/source-sans-3",
    },
  ],
  core: {
    disableTelemetry: true,
  },
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite")
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          // Stories import like consumers; CSS must not go through this alias
          "@nhic/currantui": resolve(here, "../../../packages/currantui/src"),
        },
      },
    })
  },
}

export default config
