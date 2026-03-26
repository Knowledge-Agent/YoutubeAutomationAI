'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Showcases({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const groups = (section as any).groups || [];
  const [selectedGroup, setSelectedGroup] = useState<string>(
    groups.length > 0 ? groups[0].name : ''
  );

  const filteredItems = useMemo(() => {
    if (!section.items) return [];
    if (!selectedGroup || !groups.length) return section.items;
    if (selectedGroup === 'all') return section.items;
    return section.items.filter((item) => item.group === selectedGroup);
  }, [section.items, selectedGroup, groups.length]);

  return (
    <section
      id={section.id || section.name}
      className={cn(
        'studio-shell relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,122,26,0.16),transparent_18%),linear-gradient(180deg,#111318_0%,#151922_100%)] py-24 md:py-36',
        section.className,
        className
      )}
    >
      <motion.div
        className="container mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
      >
        {section.sr_only_title && (
          <h1 className="sr-only">{section.sr_only_title}</h1>
        )}
        <h2 className="studio-title mx-auto mb-6 max-w-full text-3xl font-bold text-pretty md:max-w-5xl lg:text-4xl">
          {section.title}
        </h2>
        <p className="studio-copy text-md mx-auto mb-4 max-w-full md:max-w-5xl">
          {section.description}
        </p>
      </motion.div>

      {groups.length > 0 && (
        <motion.div
          className="container mb-12 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
          {groups.map(
            (group: { name: string; title: string }, index: number) => {
              const isSelected = selectedGroup === group.name;
              return (
                <motion.button
                  key={group.name}
                  onClick={() => setSelectedGroup(group.name)}
                  className={cn(
                    'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                    isSelected
                      ? ''
                      : 'studio-chip border hover:bg-[var(--studio-hover)] hover:text-[var(--studio-ink)]'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSelected ? (
                    <>
                      <span className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,var(--brand-signal),var(--video-accent))] p-[2px]">
                        <span className="block h-full w-full rounded-[calc(0.5rem-2px)] bg-[var(--studio-panel)]" />
                      </span>
                      <span className="relative z-10 text-[var(--studio-ink)]">
                        {group.title}
                      </span>
                    </>
                  ) : (
                    <span>{group.title}</span>
                  )}
                </motion.button>
              );
            }
          )}
        </motion.div>
      )}

      <div className="container grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => {
            const hasButton = !!(item as any).button;
            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <Card className="studio-surface overflow-hidden border p-0 shadow-[0_18px_42px_rgba(0,0,0,0.28)] transition-all hover:border-white/12 hover:shadow-[0_22px_56px_rgba(0,0,0,0.34)]">
                  <CardContent className="p-0">
                    <motion.div
                      className="relative aspect-16/10 w-full overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={item.image?.src ?? ''}
                        alt={item.image?.alt ?? ''}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        className="rounded-t-lg object-cover transition-transform duration-300"
                      />
                    </motion.div>
                    <div className="p-6">
                      <h3 className="studio-title mb-2 line-clamp-1 text-xl font-semibold text-balance">
                        {item.title}
                      </h3>
                      <p
                        className="studio-copy line-clamp-3 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: item.description ?? '',
                        }}
                      />
                      {hasButton && (
                        <div className="mt-4">
                          <Button
                            asChild
                            variant={(item as any).button.variant || 'default'}
                            size={(item as any).button.size || 'sm'}
                            className="h-8 w-full border-0 bg-[var(--brand-signal)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[var(--brand-signal-strong)]"
                          >
                            <Link
                              href={(item as any).button.url || ''}
                              target={(item as any).button.target || '_self'}
                            >
                              {(item as any).button.icon && (
                                <SmartIcon
                                  name={(item as any).button.icon as string}
                                  className="text-white"
                                />
                              )}
                              {(item as any).button.title}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );

            return hasButton ? (
              <div key={index}>{cardContent}</div>
            ) : (
              <Link key={index} href={item.url || ''} target={item.target}>
                {cardContent}
              </Link>
            );
          })
        ) : (
          <motion.div
            className="studio-copy col-span-full text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            No items found in this category.
          </motion.div>
        )}
      </div>
    </section>
  );
}
