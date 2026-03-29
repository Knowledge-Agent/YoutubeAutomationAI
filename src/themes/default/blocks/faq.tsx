'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Faq({
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
        'landing-shell-soft py-24 md:py-32',
        section.className,
        className
      )}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <ScrollAnimation>
          <div className="mx-auto max-w-3xl text-center text-balance">
            <h2 className="landing-title mx-auto max-w-4xl text-[40px] font-medium tracking-tighter text-balance md:text-[42px]">
              {section.title}
            </h2>
            <p className="landing-copy mx-auto mt-4 max-w-3xl md:text-xl/relaxed">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="landing-surface mx-auto mt-12 max-w-4xl rounded-[1.75rem] border p-1.5 shadow-[0_10px_24px_rgba(23,24,28,0.06)]">
            <Accordion type="single" collapsible className="w-full">
              {section.items?.map((item, idx) => (
                <div className="group" key={idx}>
                  <AccordionItem
                    value={item.question || item.title || ''}
                    className="peer rounded-[1.1rem] border-none px-5 py-1 data-[state=open]:bg-[var(--landing-canvas)]"
                  >
                    <AccordionTrigger
                      id={`faq-trigger-${idx + 1}`}
                      aria-controls={`faq-content-${idx + 1}`}
                      className="landing-title cursor-pointer text-left text-base font-medium hover:no-underline"
                    >
                      {item.question || item.title || ''}
                    </AccordionTrigger>
                    <AccordionContent
                      id={`faq-content-${idx + 1}`}
                      aria-labelledby={`faq-trigger-${idx + 1}`}
                    >
                      <p className="landing-copy text-base leading-7">
                        {item.answer || item.description || ''}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <hr className="mx-5 border-[color:var(--landing-line)] group-last:hidden peer-data-[state=open]:opacity-0" />
                </div>
              ))}
            </Accordion>

            <p
              className="landing-copy px-6 pt-4 pb-5 text-sm leading-6"
              dangerouslySetInnerHTML={{ __html: section.tip || '' }}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
