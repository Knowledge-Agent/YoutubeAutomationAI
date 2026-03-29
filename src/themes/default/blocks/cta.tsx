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
        'landing-shell relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(255,122,26,0.12),transparent_22%),linear-gradient(180deg,#f3eee5_0%,#eee7db_58%,#e7decf_100%)] py-24 md:py-32',
        section.className,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,184,166,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(23,24,28,0)_0%,rgba(23,24,28,0.06)_100%)]" />
      <div className="container px-4 py-12 md:px-6 md:py-24 lg:py-32">
        <div className="landing-surface relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border px-6 py-10 text-center shadow-[0_24px_56px_rgba(23,24,28,0.10)] md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,122,26,0.45),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,122,26,0.09),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(30,184,166,0.06),transparent_22%)]" />
          <ScrollAnimation>
            <h2 className="landing-title relative mx-auto mb-2 max-w-3xl text-[40px] font-medium tracking-tighter text-balance md:text-[42px]">
              {section.title}
            </h2>
          </ScrollAnimation>
          <ScrollAnimation delay={0.15}>
            <p
              className="landing-copy relative mx-auto max-w-[700px] text-balance md:text-xl/relaxed"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </ScrollAnimation>
          <ScrollAnimation delay={0.3}>
            <div className="relative mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              {section.buttons?.map((button, idx) => (
                <Button
                  asChild
                  size={button.size || 'lg'}
                  variant={idx === 0 ? 'default' : 'outline'}
                  key={idx}
                  className={cn(
                    'h-11 rounded-xl px-6 text-sm font-medium shadow-xs',
                    idx === 0
                      ? 'bg-[var(--brand-signal)] text-white shadow-[0_12px_26px_rgba(229,106,17,0.24)] hover:bg-[var(--brand-signal-strong)]'
                      : 'border-[color:var(--landing-line)] bg-[var(--landing-surface)] text-[var(--landing-ink)] hover:bg-[var(--landing-hover)]'
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
