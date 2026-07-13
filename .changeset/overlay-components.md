---
"@nhic/currantui": minor
---

Six new overlay and disclosure components:

- `Popover` family (`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverAnchor`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`) sharing the Select/DropdownMenu glass surface treatment.
- `DropdownMenu` family (content, items with `variant="destructive"`, checkbox/radio items, sub-menus, labels, separators, shortcuts) — covers Spectrum Menu/ActionMenu/MenuButton and Carbon OverflowMenu.
- `Sheet` family (side panels from top/right/bottom/left) following the Dialog overlay conventions.
- `Accordion` family (contained style, single or multiple expansion).
- `Collapsible` (thin Radix wrapper for disclosure patterns).
- `Alert` family with `default | destructive | success | warning | info` variants — the first consumer of the status tokens, plus an `AlertAction` slot.
