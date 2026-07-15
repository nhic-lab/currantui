---
"@nhic/currantui": minor
---

Numeric, tag, and file input components:

- `NumberField` — locale-aware numeric input with stacked stepper buttons; `formatOptions` covers decimals, percent, currency, and units, plus min/max/step.
- `TagGroup` + `Tag` — keyboard-navigable tag collection with removal (`onRemove`) and single/multiple selection; Badge stays the static chip, FilterChip the filter-bar affordance.
- `DropZone` + `FileTrigger` — file drop target with highlighted drop state and an outline-button browse trigger.
- `FileUploader` — drop zone + browse + file list composition with per-file `uploading | complete | error` status, progress, sizes, and remove buttons; the app owns the network and reports state back through `items`.
