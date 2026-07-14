---
"@nhic/currantui": minor
---

Spectrum-style toasts: `toast.info/success/warning/error` now render a custom toast matching React Spectrum's Toast anatomy — solid status-token fill, filled status icon, title + optional description, outlined action button, divider, and close button, with `--background` as the ink (the AA-checked inverted pairing in both palettes). The API is unchanged (drop-in sonner signatures, including `{ description, action: { label, onClick } }`); neutral `toast()`, `toast.loading`, and `toast.promise` keep the glass popover treatment.
