import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/components/*.tsx",
    "!src/components/*.stories.tsx",
    "src/lib/*.ts",
    "src/hooks/*.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  splitting: true,
  clean: true,
  target: "es2022",
  outDir: "dist",
  banner: {
    js: '"use client"',
  },
})
