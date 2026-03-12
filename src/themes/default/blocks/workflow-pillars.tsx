'use client';

import { motion } from 'motion/react';

import { LazyImage, SmartIcon } from '@/shared/blocks/common';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function WorkflowPillars({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const items = Array.isArray(section.items) ? section.items : [];
  const stages = Array.isArray(section.stages) ? section.stages : [];

  return (
    <section
      id={section.id}
      className={cn(
        'bg-[#f8f8f9] py-24 md:py-32',
        section.className,
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mx-auto mt-4 max-w-4xl text-[40px] font-medium tracking-tighter text-balance text-zinc-950 md:text-[42px]">
            {section.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-balance md:text-xl/relaxed">
            {section.description}
          </p>
        </motion.div>

        <div className="mt-16 space-y-8 md:space-y-12">
          {items.map((item: any, idx: number) => (
            <motion.div
              key={item.title || idx}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={cn(
                'grid items-center gap-8 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] md:grid-cols-[0.92fr_1.08fr] md:p-8',
                idx % 2 === 1 &&
                  'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
              )}
            >
              <div className="space-y-5 px-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 shadow-xs">
                  {item.icon ? (
                    <SmartIcon name={item.icon as string} className="size-5" />
                  ) : null}
                </div>

                <div className="space-y-4">
                  <h3 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-950 md:text-[2.15rem]">
                    {item.title}
                  </h3>
                  <p className="max-w-xl text-base leading-8 text-zinc-500 md:text-lg">
                    {item.description}
                  </p>
                </div>

                {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {item.keywords.slice(0, 4).map((keyword: string) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-[1.6rem] border border-zinc-200 bg-zinc-50 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="aspect-[16/10] overflow-hidden">
                  <LazyImage
                    src={item.image?.src ?? '/imgs/features/landing-page.png'}
                    alt={item.image?.alt ?? item.title ?? ''}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {stages.length > 0 && (
          <div className="mt-16 rounded-[1.75rem] border border-zinc-200 bg-zinc-50/80 p-6 md:p-8">
            <div className="mb-6 max-w-2xl">
              <p className="text-sm font-medium tracking-tight text-zinc-500">
                Workflow at a glance
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              {stages.map((stage: any, idx: number) => (
                <div
                  key={stage.title || idx}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.04)]"
                >
                  <div className="mb-3 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500">
                    {stage.badge || `Stage ${idx + 1}`}
                  </div>
                  <p className="text-base font-semibold text-zinc-950">
                    {stage.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
