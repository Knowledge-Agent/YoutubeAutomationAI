'use client';

import { ArrowBigRight } from 'lucide-react';

import { SmartIcon } from '@/shared/blocks/common';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function FeaturesStep({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const itemCount = section.items?.length ?? 0;
  const gridColsClass =
    itemCount >= 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : itemCount === 3
        ? 'sm:grid-cols-2 lg:grid-cols-3'
        : 'sm:grid-cols-2';

  return (
    <section
      id={section.id}
      className={cn(
        'landing-shell-soft py-14 md:py-20',
        section.className,
        className
      )}
    >
      <div className="m-4 rounded-[2rem]">
        <div className="@container relative container">
          <ScrollAnimation>
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-[var(--brand-signal)]">{section.label}</span>
              <h2 className="landing-title mt-3 text-4xl font-semibold">
                {section.title}
              </h2>
              <p className="landing-copy mx-auto mt-4 max-w-2xl text-lg text-balance">
                {section.description}
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2}>
            <div
              className={cn(
                'mt-10 grid gap-10 md:mt-12 md:gap-8',
                gridColsClass
              )}
            >
              {section.items?.map((item, idx) => (
                <div className="space-y-6" key={idx}>
                  <div className="text-center">
                    <span className="mx-auto flex size-6 items-center justify-center rounded-full bg-[var(--landing-hover-strong)] text-sm font-medium text-[var(--landing-ink)]">
                      {idx + 1}
                    </span>
                    <div className="relative">
                      <div className="landing-surface-muted mx-auto my-6 flex w-fit rounded-2xl border p-3 shadow-xs">
                        {item.icon && (
                          <SmartIcon name={item.icon as string} size={24} />
                        )}
                      </div>
                      {idx < (section.items?.length ?? 0) - 1 && (
                        <ArrowBigRight className="fill-muted stroke-primary absolute inset-y-0 right-0 my-auto mt-1 hidden translate-x-[150%] drop-shadow lg:block" />
                      )}
                    </div>
                    <h3 className="landing-title mb-4 text-lg font-semibold">
                      {item.title}
                    </h3>
                    <p className="landing-copy text-balance">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
