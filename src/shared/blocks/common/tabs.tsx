'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from '@/core/i18n/navigation';
import { ScrollArea, ScrollBar } from '@/shared/components/ui/scroll-area';
import {
  Tabs as TabsComponent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { cn } from '@/shared/lib/utils';
import { Tab } from '@/shared/types/blocks/common';

export function Tabs({
  tabs,
  size,
}: {
  tabs: Tab[];
  size?: 'sm' | 'md' | 'lg';
}) {
  const router = useRouter();
  const isFirstRender = useRef(true);
  const [tabName, setTabName] = useState(
    tabs?.find((tab) => tab.is_active)?.name || ''
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (tabName) {
      const currentTab =
        tabs?.find((tab) => tab.name === tabName) || ({} as Tab);
      if (currentTab.url) {
        router.push(currentTab.url);
      }
    }
  }, [router, tabName, tabs]);

  return (
    <div className="relative mb-8">
      <ScrollArea className="w-full lg:max-w-none">
        <div className="flex items-center space-x-2">
          <TabsComponent value={tabName} onValueChange={setTabName}>
            <TabsList className={cn(size === 'sm' && 'h-8')}>
              {tabs.map((tab, idx) => (
                <TabsTrigger
                  key={idx}
                  value={tab.name || ''}
                  id={`common-tabs-trigger-${tab.name || idx}`}
                  aria-controls={`common-tabs-content-${tab.name || idx}`}
                >
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </TabsComponent>
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
