---
"@nhic/currantui": minor
---

Command palette and searchable combobox (adds the `cmdk` runtime dependency, MIT):

- `Command` family (`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`) — filterable command list, inline or as a palette dialog on the house Dialog.
- `Combobox` — searchable single-select over a typed `options` array with controlled/uncontrolled value, disabled options, empty state, and `filter`/`shouldFilter` passthrough. Plain Select stays the default for short known lists; async/multi-select remain app-side compositions.
