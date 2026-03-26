import { Link } from '@/core/i18n/navigation';
import {
  BrandLogo,
  Copyright,
  LocaleSelector,
  ThemeToggler,
} from '@/shared/blocks/common';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { NavItem } from '@/shared/types/blocks/common';
import { Footer as FooterType } from '@/shared/types/blocks/landing';

export function Footer({ footer }: { footer: FooterType }) {
  const navGroups = footer.nav?.items ?? [];
  const agreementItems = footer.agreement?.items ?? [];
  const socialItems = footer.social?.items ?? [];
  const showControls =
    footer.show_theme !== false || footer.show_locale !== false;

  return (
    <footer
      id={footer.id}
      className={`landing-shell relative overflow-x-hidden border-t border-[color:var(--landing-line)] bg-[linear-gradient(180deg,#e8dfd0_0%,#f3eee5_28%,#f8f4ec_100%)] py-10 sm:py-12 ${footer.className || ''}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,122,26,0.42),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,26,0.08),transparent_24%),radial-gradient(circle_at_top_right,rgba(30,184,166,0.05),transparent_22%)]" />
      <div className="container space-y-8 overflow-x-hidden">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] md:items-start">
          <div className="max-w-xl space-y-5">
            {footer.brand ? <BrandLogo brand={footer.brand} /> : null}

            {footer.brand?.description ? (
              <p
                className="landing-copy max-w-lg text-sm leading-8 text-balance break-words"
                dangerouslySetInnerHTML={{ __html: footer.brand.description }}
              />
            ) : null}
          </div>

          {navGroups.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 md:justify-self-end">
              {navGroups.map((item, idx) => (
                <div
                  key={idx}
                  className="min-w-0 space-y-4 text-sm break-words md:min-w-[160px]"
                >
                  <span className="landing-title block font-medium break-words">
                    {item.title}
                  </span>

                  <div className="flex min-w-0 flex-wrap gap-4 sm:flex-col">
                    {item.children?.map((subItem, iidx) => (
                      <Link
                        key={iidx}
                        href={subItem.url || ''}
                        target={subItem.target || ''}
                        className="landing-copy block break-words duration-150 hover:text-[var(--landing-ink)]"
                      >
                        <span className="break-words">
                          {subItem.title || ''}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {showControls ? (
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1" />
            {footer.show_theme !== false ? (
              <ThemeToggler type="toggle" />
            ) : null}
            {footer.show_locale !== false ? (
              <LocaleSelector type="button" />
            ) : null}
          </div>
        ) : null}

        <div
          aria-hidden
          className="h-px min-w-0 [background-image:linear-gradient(90deg,var(--landing-line)_1px,transparent_1px)] bg-[length:6px_1px] bg-repeat-x opacity-90"
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {footer.copyright ? (
            <p
              className="landing-copy text-sm leading-7 text-balance break-words"
              dangerouslySetInnerHTML={{ __html: footer.copyright }}
            />
          ) : footer.brand ? (
            <Copyright brand={footer.brand} />
          ) : (
            <div />
          )}

          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            {agreementItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                {agreementItems.map((item: NavItem, index: number) => (
                  <Link
                    key={index}
                    href={item.url || ''}
                    target={item.target || ''}
                    className="landing-copy block text-xs break-words underline duration-150 hover:text-[var(--landing-ink)]"
                  >
                    {item.title || ''}
                  </Link>
                ))}
              </div>
            ) : null}

            {socialItems.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                {socialItems.map((item: NavItem, index) => (
                  <Link
                    key={index}
                    href={item.url || ''}
                    target={item.target || ''}
                    className="landing-surface block cursor-pointer rounded-full border p-2 duration-150 shadow-[0_10px_22px_rgba(23,24,28,0.05)] hover:bg-[var(--landing-hover)] hover:text-[var(--landing-ink)]"
                    aria-label={item.title || 'Social media link'}
                  >
                    {item.icon && (
                      <SmartIcon name={item.icon as string} size={20} />
                    )}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
