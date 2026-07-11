# CurrantUI — Overview

## Problem

Every National Health Intelligence Center (NHIC) enterprise project rebuilds the same UI foundation: buttons, dialogs, form controls, theming, dark mode, fonts. eRadia's `@workspace/ui` package solved this well for one repo, but it was locked inside the eRadia monorepo — other projects couldn't consume it without copy-pasting, and copies drift.

## Solution

CurrantUI extracts that package into a standalone, versioned design system published as `@nhic/currantui`. It ships shadcn/ui + Radix primitives styled with Tailwind v4 design tokens, compiled to ESM + type declarations so any modern React stack (Vite, Next.js, TanStack Start) consumes it identically. The eRadia look is the default theme; projects re-brand by overriding CSS variables, never by forking components.

## Target users

NHIC engineering teams building internal and product web applications. This is an internal package — no external customers, no monetization.

## Non-goals

- Not a general-purpose open-source component library — API decisions serve NHIC projects only.
- No app-specific logic: data fetching, routing, auth, and business rules stay in consuming apps.
- No CSS-in-JS or alternative styling systems — Tailwind v4 is the only styling path.
- No support for React < 19 or Tailwind < 4.

## Success criteria (v1)

- Published to npmjs under the `nhic` org and installable with one `pnpm add`.
- A consumer gets full styling with a single CSS line: `@import "@nhic/currantui/globals.css";`.
- eRadia migrates off its in-workspace `packages/ui` onto the published package with only a mechanical import rename.
- New primitives can be added with `pnpm dlx shadcn add` and released via a changeset without manual versioning.
