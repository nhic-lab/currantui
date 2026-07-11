import { HicLogo } from "@nhic/currantui/components/hic-logo"
import type { ReactNode } from "react"

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  title: string
  links: Array<FooterLink>
}

interface SiteFooterProps {
  columns: Array<FooterColumn>
  copyright: ReactNode
  brandHref: string
  brandAria: string
  /** Brand slot; defaults to HicLogo */
  brand?: ReactNode
  /** Coat-of-arms URL forwarded to the default HicLogo brand */
  logoSrc?: string
}

export function SiteFooter({
  columns,
  copyright,
  brandHref,
  brandAria,
  brand,
  logoSrc,
}: SiteFooterProps) {
  return (
    <footer className="mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-[max(env(safe-area-inset-right),1.5rem)] py-12 text-sm">
      <div className="grid grid-cols-1 items-start gap-8 min-[401px]:grid-cols-2 md:grid-cols-3 md:gap-x-8 md:gap-y-10 xl:grid-cols-4">
        <a
          href={brandHref}
          className="col-span-full text-inherit no-underline xl:col-span-1"
          aria-label={brandAria}
        >
          {brand ?? <HicLogo src={logoSrc} />}
        </a>
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-4 text-sm font-bold tracking-[-0.01em] text-foreground/90">
              {col.title}
            </h2>
            <ul className="flex list-none flex-col gap-3">
              {col.links.map((link) => {
                const external = /^https?:\/\//.test(link.href)
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                      className="text-muted-foreground no-underline transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-8 text-center text-muted-foreground">
        {copyright}
      </div>
    </footer>
  )
}
