import { Link } from '@/core/i18n/navigation';
import { BrandLogo } from '@/shared/blocks/common';
import { Header as HeaderType } from '@/shared/types/blocks/landing';

export function LandingBottomNav({ header }: { header: HeaderType }) {
  const navItems = header.nav?.items || [];

  return (
    <section className="border-t border-[color:var(--studio-line)] bg-[#0f1118]">
      <div className="container py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-2">
            {header.brand ? (
              <div className="text-white">
                <BrandLogo brand={header.brand} />
              </div>
            ) : null}
            <p className="text-sm leading-6 text-[var(--studio-muted)]">
              Browse the tools directly from the homepage, then jump to the blog
              whenever you want the long-form workflow breakdowns.
            </p>
          </div>

          <nav
            aria-label="Homepage bottom navigation"
            className="flex flex-wrap items-center gap-3"
          >
            {navItems.map((item) => {
              if (!item.url || !item.title) {
                return null;
              }

              const isBlogLink = item.url === '/blog';

              return (
                <Link
                  key={`${item.title}-${item.url}`}
                  href={item.url}
                  target={item.target || '_self'}
                  className={
                    isBlogLink
                      ? 'inline-flex h-11 items-center justify-center rounded-full bg-[var(--brand-signal)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--brand-signal-strong)]'
                      : 'inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--studio-line)] bg-white/5 px-5 text-sm font-medium text-[var(--studio-muted)] transition hover:border-white/16 hover:bg-white/8 hover:text-white'
                  }
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
