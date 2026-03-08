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
        'bg-[#060816] py-20 text-white md:py-28',
        section.className,
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl md:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
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
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-orange-500/40 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-300">
                {item.icon ? (
                  <SmartIcon name={item.icon as string} className="size-6" />
                ) : null}
              </div>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {item.description}
              </p>
              {Array.isArray(item.keywords) && item.keywords.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.keywords.map((keyword: string) => (
                    <span
                      key={keyword}
                      className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs text-orange-300"
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
