import { tanstackConfig } from "@tanstack/eslint-config"
import storybook from "eslint-plugin-storybook"

export default [
  { ignores: ["**/dist/**", "**/storybook-static/**"] },
  ...tanstackConfig,
  ...storybook.configs["flat/recommended"],
]
