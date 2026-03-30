'use client';

import { useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import {
  BrandLogo,
  LocaleSelector,
  SignUser,
  ThemeToggler,
} from '@/shared/blocks/common';
import { cn } from '@/shared/lib/utils';
import { NavItem } from '@/shared/types/blocks/common';
import { Header as HeaderType } from '@/shared/types/blocks/landing';

function DesktopNavItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const closeMenu = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  if (!item.children || item.children.length === 0) {
    const itemUrl = item.url || '';
    const isActive =
      item.is_active ||
      (itemUrl === '/' ? pathname === '/' : pathname.startsWith(itemUrl));

    return (
      <Link
        href={itemUrl}
        target={item.target || '_self'}
        className={cn(
          'text-[1.08rem] font-medium tracking-tight text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-ink)]',
          isActive && 'text-[var(--landing-ink)]'
        )}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div
      className="relative flex items-center gap-1 py-2"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      {item.url ? (
        <Link
          href={item.url}
          target={item.target || '_self'}
          className="text-[1.08rem] font-medium tracking-tight text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-ink)]"
          onFocus={openMenu}
          onBlur={closeMenu}
        >
          {item.title}
        </Link>
      ) : (
        <button
          type="button"
          className="text-[1.08rem] font-medium tracking-tight text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-ink)]"
          onFocus={openMenu}
          onBlur={closeMenu}
        >
          {item.title}
        </button>
      )}
      <ChevronDown
        className={cn(
          'size-4 text-[var(--landing-muted)] transition',
          open && 'text-[var(--landing-ink)]'
        )}
      />

      <div
        className={cn(
          'absolute top-full left-1/2 z-30 w-64 -translate-x-1/2 pt-2 transition duration-150',
          open
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <div className="rounded-[1.7rem] border border-[color:var(--landing-line)] bg-[rgb(251_248_242_/_0.96)] p-2 shadow-[0_22px_44px_rgba(23,24,28,0.12)] backdrop-blur-xl">
          <div className="space-y-1">
            {item.children.map((subItem, index) => (
              <Link
                key={`${subItem.title}-${index}`}
                href={subItem.url || ''}
                target={subItem.target || '_self'}
                className="block rounded-[1.15rem] px-3 py-3 text-sm font-medium text-[var(--landing-muted)] transition hover:bg-[var(--landing-hover)] hover:text-[var(--landing-ink)]"
              >
                {subItem.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header({ header }: { header: HeaderType }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const buttons = header.buttons || [];

  return (
    <header className="landing-glass fixed inset-x-0 top-0 z-50 border-b shadow-[0_1px_0_rgba(23,24,28,0.04)] backdrop-blur-md">
      <div className="container px-4 md:px-6">
        <div className="flex h-15 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center">
            {header.brand && <BrandLogo brand={header.brand} />}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <nav className="mr-1 flex items-center gap-8">
              {header.nav?.items?.map((item, idx) => (
                <DesktopNavItem
                  key={`${item.title}-${idx}`}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </nav>

            {buttons.map((button, idx) => {
              const variant =
                button.variant || (idx === buttons.length - 1 ? 'default' : 'outline');
              return (
                <Link
                  key={`${button.title}-${idx}`}
                  href={button.url || ''}
                  target={button.target || '_self'}
                  className={cn(
                    'inline-flex h-12 items-center justify-center text-base font-medium tracking-tight transition',
                    variant === 'default'
                      ? 'rounded-full bg-white px-8 text-[#111114] shadow-[0_12px_28px_rgba(0,0,0,0.14)] hover:bg-[#f3f1ee]'
                      : 'rounded-full px-5 text-white/88 hover:text-white'
                  )}
                >
                  {button.title}
                </Link>
              );
            })}

            {header.show_theme ? <ThemeToggler /> : null}
            {header.show_locale ? <LocaleSelector /> : null}
            {header.show_sign ? <SignUser userNav={header.user_nav} /> : null}
          </div>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[color:var(--landing-line)] text-[var(--landing-muted)] transition hover:bg-[var(--landing-hover)] lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[color:var(--landing-line)] py-4 lg:hidden">
            <nav className="space-y-2">
              {header.nav?.items?.map((item, idx) =>
                item.children && item.children.length > 0 ? (
                  <div key={`${item.title}-${idx}`} className="space-y-1">
                    {item.url ? (
                      <Link
                        href={item.url}
                        target={item.target || '_self'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-xl px-3 py-3 text-base font-semibold tracking-tight text-[var(--landing-ink)] transition hover:bg-[var(--landing-hover)]"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <p className="px-2 text-sm font-semibold tracking-tight text-[var(--landing-muted)]">
                        {item.title}
                      </p>
                    )}
                    {item.children.map((subItem, subIndex) => (
                      <Link
                        key={`${subItem.title}-${subIndex}`}
                        href={subItem.url || ''}
                        target={subItem.target || '_self'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-xl px-3 py-3 text-base font-medium tracking-tight text-[var(--landing-muted)] transition hover:bg-[var(--landing-hover)] hover:text-[var(--landing-ink)]"
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={`${item.title}-${idx}`}
                    href={item.url || ''}
                    target={item.target || '_self'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-medium tracking-tight text-[var(--landing-muted)] transition hover:bg-[var(--landing-hover)] hover:text-[var(--landing-ink)]"
                  >
                    {item.title}
                  </Link>
                )
              )}

              {buttons.length > 0 && (
                <div className="flex flex-col gap-2 pt-3">
                  {buttons.map((button, idx) => {
                    const variant =
                      button.variant || (idx === buttons.length - 1 ? 'default' : 'outline');
                    return (
                      <Link
                        key={`${button.title}-${idx}`}
                        href={button.url || ''}
                        target={button.target || '_self'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'inline-flex h-11 items-center justify-center text-sm font-medium tracking-tight transition',
                          variant === 'default'
                            ? 'rounded-full bg-white px-5 text-[#111114] hover:bg-[#f3f1ee]'
                            : 'rounded-full border border-white/10 bg-transparent px-5 text-[var(--landing-muted)] hover:bg-[var(--landing-hover)] hover:text-[var(--landing-ink)]'
                        )}
                      >
                        {button.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
