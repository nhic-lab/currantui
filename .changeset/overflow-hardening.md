---
"@nhic/currantui": minor
---

Overflow hardening: DialogContent gains a size prop (sm–xl, full) with a viewport-capped height and a new DialogBody scroll region so footers stay clickable — its internal layout is now flex-column, so grid utilities passed via className no longer apply; Textarea gains size presets that cap auto-growth and scroll past the cap; PopoverContent (and combobox, toggletip, and contextual help built on it) and DropdownMenuSubContent cap to the available viewport height and scroll; the react-aria date-picker popovers scroll within their measured max-height instead of clipping; SheetContent caps top/bottom sheets and the new SheetBody scrolls between pinned header and footer. Defaults preserve current dimensions; className overrides win.
