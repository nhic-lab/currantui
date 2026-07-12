---
"@nhic/currantui": minor
---

Component fixes and additions surfaced by the Storybook workbench:

- `NotificationsButton` can now open a notification panel — pass `count` and compose the new `NotificationList` + `NotificationItem` exports as children; without children it stays the original tooltip-only bell.
- `Loader` actually spins: the `orbit-spin` keyframes it references were missing and are now defined in `globals.css`.
- `Input` with `type="file"` shows a leading folder icon.
- `ErrorPage` content blocks use one even vertical rhythm, with the detail lines grouped as a paragraph.
- `ThemeToggle` persists under the `currantui-theme` localStorage key (previously a legacy app-specific name); a theme preference saved by an earlier version resets to system default once. It also now derives its state from the `dark` class on `<html>` (observed live) instead of localStorage, so it stays correct when something else — a pre-paint script, another toggle instance — changes the theme, and the first click is never a no-op.
