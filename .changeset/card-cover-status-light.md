---
"@nhic/currantui": minor
---

Richer cards and a status indicator:

- `CardCover` — full-bleed media area for the top of a Card (image, token gradient, or any visual); the card stories show cover, profile (overlapping avatar), and stat anatomies.
- `StatusLight` — colored dot + label for states that aren't counts or alerts (published, available, offline…), with the status variant vocabulary plus `muted`.
- `CardViewItem` is now unpadded so covers bleed edge-to-edge — compose `CardCover` + a padded body inside items.
