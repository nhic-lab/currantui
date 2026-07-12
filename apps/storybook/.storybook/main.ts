import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import remarkGfm from "remark-gfm"

import type { StorybookConfig } from "@storybook/react-vite"

const here = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

/* The font is a dependency of packages/currantui, so with pnpm it is only
   guaranteed to exist in that package's node_modules — resolve it from
   there instead of assuming a hoisted copy at the workspace root */
const sourceSans3Files = join(
  dirname(
    require.resolve("@fontsource-variable/source-sans-3/package.json", {
      paths: [resolve(here, "../../../packages/currantui")],
    }),
  ),
  "files",
)

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
      from: sourceSans3Files,
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
