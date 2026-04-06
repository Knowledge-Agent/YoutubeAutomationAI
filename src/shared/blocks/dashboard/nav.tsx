'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { Link, usePathname } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/components/ui/sidebar';
import { NavItem, type Nav as NavType } from '@/shared/types/blocks/common';

export function Nav({ nav, className }: { nav: NavType; className?: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMenuButtonClassName = (isActive: boolean) =>
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground active:bg-sidebar-accent/90 active:text-sidebar-accent-foreground min-w-8 duration-200 ease-linear'
      : '';

  const renderSubItems = (items: NavItem[]) => (
    <SidebarMenuSub>
      {items.map((subItem: NavItem) => (
        <SidebarMenuSubItem key={subItem.title || subItem.url}>
          <SidebarMenuSubButton
            asChild
            className={getMenuButtonClassName(
              !!subItem.is_active ||
                (mounted && pathname.endsWith(subItem.url as string))
            )}
          >
            <Link href={subItem.url as string} target={subItem.target as string}>
              <span className="px-2">{subItem.title}</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </SidebarMenuSub>
  );

  if (!mounted) {
    return (
      <SidebarGroup className={className}>
        <SidebarGroupContent className="mt-0 flex flex-col gap-2">
          {nav.title && <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>}
          <SidebarMenu>
            {nav.items.map((item: NavItem | undefined) => (
              <SidebarMenuItem key={item?.title || item?.url || ''}>
                {item?.children ? (
                  <>
                    <SidebarMenuButton
                      className={getMenuButtonClassName(!!item?.is_active)}
                    >
                      {item?.icon && <SmartIcon name={item.icon as string} />}
                      <span>{item?.title || ''}</span>
                      <ChevronRight
                        className={`ml-auto transition-transform duration-200 ${
                          item?.is_expand ? 'rotate-90' : ''
                        }`}
                      />
                    </SidebarMenuButton>
                    {item.is_expand && renderSubItems(item.children)}
                  </>
                ) : (
                  <SidebarMenuButton
                    asChild
                    className={getMenuButtonClassName(!!item?.is_active)}
                  >
                    <Link
                      href={item?.url as string}
                      target={item?.target as string}
                    >
                      {item?.icon && <SmartIcon name={item.icon as string} />}
                      <span>{item?.title || ''}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="mt-0 flex flex-col gap-2">
        {nav.title && <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>}
        <SidebarMenu>
          {nav.items.map((item: NavItem | undefined) => (
            <Collapsible
              key={item?.title || item?.url || ''}
              asChild
              defaultOpen={item?.is_expand || false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item?.children ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item?.title}
                      className={getMenuButtonClassName(
                        !!item?.is_active ||
                          !!(
                            item?.url &&
                            pathname.startsWith(item.url as string)
                          )
                      )}
                    >
                      {item?.icon && <SmartIcon name={item.icon as string} />}
                      <span>{item?.title || ''}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item?.title}
                    className={getMenuButtonClassName(
                      !!item?.is_active ||
                        !!(item?.url && pathname.startsWith(item.url as string))
                    )}
                  >
                    <Link
                      href={item?.url as string}
                      target={item?.target as string}
                    >
                      {item?.icon && <SmartIcon name={item.icon as string} />}
                      <span>{item?.title || ''}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                {item?.children && (
                  <CollapsibleContent>
                    {renderSubItems(item.children)}
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
