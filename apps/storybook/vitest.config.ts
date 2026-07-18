import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { defineConfig } from "vitest/config"

const here = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    projects: [
      {
        // Inherits stories globs, the alias, and the Tailwind plugin from main.ts
        plugins: [
          storybookTest({
            configDir: join(here, ".storybook"),
            storybookScript: "pnpm dev --ci",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
      {
        resolve: {
          alias: {
            "@nhic/currantui": join(here, "../../packages/currantui/src"),
          },
        },
        test: {
          name: "unit",
          environment: "node",
          include: [join(here, "../../packages/*/src/**/*.test.ts")],
        },
      },
    ],
  },
})
