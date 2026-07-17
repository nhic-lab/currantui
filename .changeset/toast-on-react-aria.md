---
"@nhic/currantui": minor
---

BREAKING: toasts now run on the react-aria toast queue instead of sonner — import `Toaster` and `toast` from `@nhic/currantui/components/toast` (the `components/sonner` entry and the sonner dependency are removed). The `toast()`/`toast.info|success|warning|error|loading` call shape is unchanged, including `description`, `action`, `size`, `duration`, and replace-by-`id`; `toast.dismiss()` clears the queue. New behavior: timers pause while the region is hovered or focused, at most three toasts are visible at once, actionable and loading toasts never auto-dismiss, and `toast.promise`/other sonner-specific APIs are gone.
