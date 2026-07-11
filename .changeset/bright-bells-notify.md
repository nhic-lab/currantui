---
"@nhic/currantui": minor
---

Component fixes and additions surfaced by the Storybook workbench:

- `NotificationsButton` can now open a notification panel — pass `count` and compose the new `NotificationList` + `NotificationItem` exports as children; without children it stays the original tooltip-only bell.
- `Loader` actually spins: the `orbit-spin` keyframes were never extracted from eRadia and are now defined in `globals.css`.
- `Input` with `type="file"` shows a leading folder icon.
- `ErrorPage` content blocks use one even vertical rhythm, with the detail lines grouped as a paragraph.
