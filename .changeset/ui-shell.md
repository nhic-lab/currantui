---
"@nhic/currantui": minor
---

Carbon-style UI Shell — a ready-made application chassis so apps stop rewriting navbar/sidebar code:

- `ShellProvider` + `useShell()` own the layout grid and state (side-nav collapse with cookie persistence and Mod+B, exclusive right panels, mobile detection); `ShellContent` and `ShellSkipToContent` complete the frame.
- `ShellHeader` family: `ShellHeaderMenuButton`, `ShellHeaderName`, `ShellHeaderNav(Link/Menu/MenuItem)`, `ShellGlobalBar`, `ShellGlobalAction` (tooltip + optional `panelId` wiring).
- `ShellSideNav` with `expandable` (hamburger-controlled, mobile overlay sheet below `lg`), `rail` (3rem icon rail expanding on hover/focus), and `fixed` variants; `ShellSideNavItems/Link/Menu/MenuItem/Divider/Footer`.
- `ShellPanel` non-modal right panels + `ShellSwitcher(Item/Divider)` product switcher.
- New `useIsMobile` hook exported at `@nhic/currantui/hooks/use-mobile`.
- `Navbar` and `SidebarItem` are deprecated (still exported) — migrate to `ShellHeader` / `ShellSideNavLink`; removal planned for the next major.

All links take `asChild` + `isActive` for router integration; chrome uses the `sidebar-*` tokens; dimensions are themable via CSS variables on the provider.
