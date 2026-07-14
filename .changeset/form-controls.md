---
"@nhic/currantui": minor
---

Nine form-control and grouping components:

- `Field` family (`Field`, `FieldLabel`, `FieldContent`, `FieldTitle`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`, `FieldSeparator`) — dependency-free label/description/error wiring around any control; grouped checkboxes/radios via FieldSet + FieldLegend.
- `RadioGroup` + `RadioGroupItem` on the checkbox size/focus recipe.
- `Slider` with multi-thumb range support and a `thumbLabels` prop for per-thumb accessible names.
- `Toggle` + `ToggleGroup` (single/multiple, outline variant, attached `spacing={0}` mode).
- `SegmentedControl` — single-select view switcher styled like the tabs list; the active option can't be deselected.
- `Meter` — static `role="meter"` measurement with status-token variants, distinct from Progress.
- `ButtonGroup` (+ `ButtonGroupText`, `ButtonGroupSeparator`) for attached/split buttons and input compositions.
- `Pagination` family for general page navigation (data tables keep `TablePagination`).
