---
"@nhic/currantui": minor
---

Make the palette WCAG AA compliant: light-mode `--primary` and `--destructive` darken to oklch L 0.52 (white-on-primary now 5.2:1, was 2.8:1; destructive-on-tint 5.2:1, was 4.0:1), and dark mode keeps the bright teal but switches `--primary-foreground` to dark ink (6.8:1). `HicLogo` gains `role="img"` so its `aria-label` is valid ARIA. Every Storybook story now passes an axe audit in CI.
