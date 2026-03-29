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
        'landing-shell py-24 md:py-32',
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
          <h2 className="landing-title mx-auto max-w-4xl text-[40px] font-medium tracking-tighter text-balance md:text-[42px]">
            {section.title}
          </h2>
          <p className="landing-copy mx-auto mt-4 max-w-3xl text-balance md:text-xl/relaxed">
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
              className="landing-surface-muted flex h-full flex-col rounded-[1.4rem] border p-6 shadow-[0_8px_22px_rgba(23,24,28,0.05)] transition-shadow hover:shadow-[0_12px_28px_rgba(23,24,28,0.07)]"
            >
              <div className="landing-surface mb-4 flex h-11 w-11 items-center justify-center rounded-xl border shadow-xs">
                {item.icon ? (
                  <SmartIcon name={item.icon as string} className="size-5" />
                ) : null}
              </div>
              <h3 className="landing-title text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="landing-copy mt-3 grow text-sm leading-7">
                {item.description}
              </p>
              {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.keywords.map((keyword: string) => (
                    <span
                      key={keyword}
                      className="landing-chip rounded-full border px-3 py-1 text-xs"
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
