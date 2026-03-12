'use client';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common/smart-icon';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Cta({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn(
        'bg-[#f8f8f9] py-24 md:py-32',
        section.className,
        className
      )}
    >
      <div className="container px-4 py-12 md:px-6 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-zinc-200 bg-white px-6 py-10 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)] md:px-10 md:py-14">
          <ScrollAnimation>
            <h2 className="mx-auto mb-2 max-w-3xl text-[40px] font-medium tracking-tighter text-balance text-zinc-950 md:text-[42px]">
              {section.title}
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.15}>
            <p
              className="text-muted-foreground mx-auto max-w-[700px] text-balance md:text-xl/relaxed"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </ScrollAnimation>
          <ScrollAnimation delay={0.3}>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              {section.buttons?.map((button, idx) => (
                <Button
                  asChild
                  size={button.size || 'lg'}
                  variant={idx === 0 ? 'default' : 'outline'}
                  key={idx}
                  className={cn(
                    'h-11 rounded-xl px-6 text-sm font-medium shadow-xs',
                    idx === 0
                      ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                      : 'border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100'
                  )}
                >
                  <Link
                    href={button.url || ''}
                    target={button.target || '_self'}
                  >
                    {button.icon && <SmartIcon name={button.icon as string} />}
                    <span>{button.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}
