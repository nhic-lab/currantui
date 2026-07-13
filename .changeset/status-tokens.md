---
"@nhic/currantui": minor
---

Add `success`, `warning`, and `info` status color tokens to `globals.css` (light + dark, WCAG AA-checked against their alpha-tint backgrounds) with `@theme inline` mappings, so `bg-success/10`, `text-warning`, `border-info/30`, etc. work in consumers. They join `destructive` under one status recipe: token as text, alpha tints of the same token as background.
