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
      className={`overflow-x-hidden border-t border-zinc-200 bg-[#f8f8f9] py-10 sm:py-12 ${footer.className || ''}`}
    >
      <div className="container space-y-8 overflow-x-hidden">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] md:items-start">
          <div className="max-w-xl space-y-5">
            {footer.brand ? <BrandLogo brand={footer.brand} /> : null}

            {footer.brand?.description ? (
              <p
                className="max-w-lg text-sm leading-8 text-balance break-words text-zinc-500"
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
                  <span className="block font-medium break-words text-zinc-950">
                    {item.title}
                  </span>

                  <div className="flex min-w-0 flex-wrap gap-4 sm:flex-col">
                    {item.children?.map((subItem, iidx) => (
                      <Link
                        key={iidx}
                        href={subItem.url || ''}
                        target={subItem.target || ''}
                        className="block break-words text-zinc-500 duration-150 hover:text-zinc-900"
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
          className="h-px min-w-0 [background-image:linear-gradient(90deg,var(--color-foreground)_1px,transparent_1px)] bg-[length:6px_1px] bg-repeat-x opacity-20"
        />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {footer.copyright ? (
            <p
              className="text-sm leading-7 text-balance break-words text-zinc-500"
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
                    className="block text-xs break-words text-zinc-500 underline duration-150 hover:text-zinc-900"
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
                    className="block cursor-pointer rounded-full border border-zinc-200 bg-white p-2 text-zinc-500 duration-150 hover:border-zinc-300 hover:text-zinc-900"
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
