import { create } from "storybook/theming/create"

/* Hex mirrors of the palette tokens in
   packages/currantui/src/styles/globals.css — Storybook's theming engine
   (polished) cannot parse oklch, so the values are pre-converted */

const shared = {
  brandTitle: "CurrantUI — NHIC Design System",
  brandUrl: "https://github.com/nhic-lab/currantui",
  brandTarget: "_blank" as const,
  fontBase: "'Source Sans 3 Variable', 'Source Sans 3', sans-serif",
  fontCode: "ui-monospace, 'SF Mono', Menlo, monospace",
  appBorderRadius: 4,
}

export const nhicDark = create({
  base: "dark",
  ...shared,
  brandImage: "./nhic-brand.svg",

  colorPrimary: "#5aa0b8",
  colorSecondary: "#2a7389",

  appBg: "#0a0a0a",
  appContentBg: "#0a0a0a",
  appPreviewBg: "#0a0a0a",
  appBorderColor: "#262626",

  textColor: "#fafafa",
  textInverseColor: "#0a0a0a",
  textMutedColor: "#a1a1a1",

  barBg: "#0a0a0a",
  barTextColor: "#a1a1a1",
  barHoverColor: "#5aa0b8",
  barSelectedColor: "#5aa0b8",

  inputBg: "#171717",
  inputBorder: "#333333",
  inputTextColor: "#fafafa",
  inputBorderRadius: 6,

  buttonBg: "#171717",
  buttonBorder: "#333333",
  booleanBg: "#171717",
  booleanSelectedBg: "#2a7389",
})

export const nhicLight = create({
  base: "light",
  ...shared,
  brandImage: "./nhic-brand-light.svg",

  colorPrimary: "#2a7389",
  colorSecondary: "#2a7389",

  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e5e5e5",

  textColor: "#0a0a0a",
  textInverseColor: "#fafafa",
  textMutedColor: "#737373",

  barBg: "#ffffff",
  barTextColor: "#737373",
  barHoverColor: "#2a7389",
  barSelectedColor: "#2a7389",

  inputBg: "#ffffff",
  inputBorder: "#e5e5e5",
  inputTextColor: "#0a0a0a",
  inputBorderRadius: 6,

  buttonBg: "#f5f5f5",
  buttonBorder: "#e5e5e5",
  booleanBg: "#f5f5f5",
  booleanSelectedBg: "#2a7389",
})
