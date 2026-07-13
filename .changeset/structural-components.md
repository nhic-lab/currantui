---
"@nhic/currantui": minor
---

Nine new structural components, all styled to house density/tokens and exported as `@nhic/currantui/components/<name>`:

- `Card` family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`) with `size="default" | "sm"`.
- `Avatar` family (`Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`) with `xs`/`sm`/`default`/`lg` sizes on the standard height scale.
- `Skeleton` loading placeholder.
- `Label` form label (Radix), pairs with inputs via `htmlFor`/`peer`.
- `Textarea` matching the `Input` chrome (auto-growing via `field-sizing-content`).
- `Breadcrumb` family (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) with RTL-aware separators.
- `Link` inline text link with `asChild` for router integration.
- `LabeledValue` label/value pair with vertical and horizontal orientations.
