---
"@nhic/currantui": minor
---

BREAKING: `AvatarButton` is now a compound component — compose `AvatarButtonTrigger`, `AvatarButtonMenu`, `AvatarButtonLabel`, `AvatarButtonItem` (with `icon`/`destructive`), and `AvatarButtonSeparator` instead of the removed `name`/`email`/`onSettings`/`onSignOut` props. The trigger now renders an image (`src`), initials (`name`), or the fallback icon. Migration: `<AvatarButton name="A" onSettings={s} />` becomes `<AvatarButton><AvatarButtonTrigger name="A" /><AvatarButtonMenu><AvatarButtonItem icon={Gear} onSelect={s}>Settings</AvatarButtonItem></AvatarButtonMenu></AvatarButton>`.
