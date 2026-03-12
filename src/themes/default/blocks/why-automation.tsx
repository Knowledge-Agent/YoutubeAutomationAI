'use client';

import { motion } from 'motion/react';

import { SmartIcon } from '@/shared/blocks/common';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function WhyAutomation({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const items = Array.isArray(section.items) ? section.items : [];

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
          <h2 className="mx-auto max-w-4xl text-[40px] font-medium tracking-tighter text-balance text-zinc-950 md:text-[42px]">
            {section.title}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-balance md:text-xl/relaxed">
            {section.description}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item: any, idx: number) => (
            <motion.div
              key={item.title || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="flex h-full flex-col rounded-[1.4rem] border border-zinc-200 bg-zinc-50/50 p-6 shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-xs">
                {item.icon ? (
                  <SmartIcon name={item.icon as string} className="size-5" />
                ) : null}
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
                {item.title}
              </h3>
              <p className="mt-3 grow text-sm leading-7 text-zinc-500">
                {item.description}
              </p>
              {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.keywords.map((keyword: string) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
