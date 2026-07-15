---
"@nhic/currantui": minor
---

Add `ProgressCircle` — a determinate ring for known completion and an indeterminate spinner when `value` is nullish, colored by `currentColor` (brand primary by default) with `sm`/`default`/`lg` sizes.

`Loader` and `LoaderOverlay` now delegate to it (same API and pixel sizes, new ring visual) and `Loader` is deprecated — migrate to `ProgressCircle`; removal planned for the next major. Toast loading spinners and the file uploader's in-flight rows use it as well.
