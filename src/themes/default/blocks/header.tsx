'use client';

import { useState } from 'react';
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
          'text-[1.08rem] font-medium tracking-tight text-zinc-800 transition-colors hover:text-zinc-950',
          isActive && 'text-zinc-950'
        )}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-[1.08rem] font-medium tracking-tight text-zinc-800 transition-colors hover:text-zinc-950"
      >
        <span>{item.title}</span>
        <ChevronDown className="size-4 text-zinc-400 transition group-hover:text-zinc-600" />
      </button>

      <div className="pointer-events-none absolute top-full left-1/2 z-30 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 opacity-0 shadow-xl transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="space-y-1">
          {item.children.map((subItem, index) => (
            <Link
              key={`${subItem.title}-${index}`}
              href={subItem.url || ''}
              target={subItem.target || '_self'}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {subItem.title}
            </Link>
          ))}
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200 bg-white/92 backdrop-blur-md">
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
              const isPrimary = idx === buttons.length - 1;
              return (
                <Link
                  key={`${button.title}-${idx}`}
                  href={button.url || ''}
                  target={button.target || '_self'}
                  className={cn(
                    'inline-flex h-9.5 items-center justify-center rounded-md px-3.5 text-sm font-medium tracking-tight transition',
                    isPrimary
                      ? 'bg-zinc-950 text-white shadow-sm hover:bg-zinc-800'
                      : 'text-zinc-800 hover:text-zinc-950'
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-zinc-200 py-4 lg:hidden">
            <nav className="space-y-2">
              {header.nav?.items?.map((item, idx) =>
                item.children && item.children.length > 0 ? (
                  <div key={`${item.title}-${idx}`} className="space-y-1">
                    <p className="px-2 text-sm font-semibold tracking-tight text-zinc-500">
                      {item.title}
                    </p>
                    {item.children.map((subItem, subIndex) => (
                      <Link
                        key={`${subItem.title}-${subIndex}`}
                        href={subItem.url || ''}
                        target={subItem.target || '_self'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block rounded-xl px-3 py-3 text-base font-medium tracking-tight text-zinc-800 transition hover:bg-zinc-100"
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
                    className="block rounded-xl px-3 py-3 text-base font-medium tracking-tight text-zinc-800 transition hover:bg-zinc-100"
                  >
                    {item.title}
                  </Link>
                )
              )}

              {buttons.length > 0 && (
                <div className="flex flex-col gap-2 pt-3">
                  {buttons.map((button, idx) => {
                    const isPrimary = idx === buttons.length - 1;
                    return (
                      <Link
                        key={`${button.title}-${idx}`}
                        href={button.url || ''}
                        target={button.target || '_self'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'inline-flex h-10 items-center justify-center rounded-md px-3.5 text-sm font-medium tracking-tight transition',
                          isPrimary
                            ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                            : 'border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-100'
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
