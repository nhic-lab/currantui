# @nhic/currantui

## 0.2.0

### Minor Changes

- dbd78f3: Add PageHeader, ErrorPage, HicLogo, and SiteFooter components, plus the design-standards doc.

  - HicLogo: the Ministry of Health / Health Intelligence Center lockup (coat-of-arms image + bilingual-ready text + optional word stamp). The coat-of-arms SVG ships at `@nhic/currantui/assets/logo.svg`; the component defaults to `src="/logo.svg"`, so copy the asset to your public root or pass a bundler-imported URL.
  - SiteFooter: portal-style footer layout with no baked-in content — `columns`, `copyright`, `brandHref`, and `brandAria` are required props (i18n is the caller's concern). The brand slot defaults to HicLogo; external links (`http(s)` hrefs) open in a new tab automatically.
  - ErrorPage: tokenized (`bg-background`/`text-foreground`/`text-muted-foreground` instead of hard-coded white/black/gray) so it follows the active theme including dark mode; accepts a `logo` slot prop, now defaulting to HicLogo.
  - PageHeader: extracted from eRadia with a new `className` prop.
  - **Removed** the eRadia `logo` component (`@nhic/currantui/components/logo`) — HicLogo is the design system's brand mark. Apps wanting a product-specific logo keep it in their own repo and pass it via the `logo`/`brand` slots.

## 0.1.0

### Minor Changes

- Initial release
