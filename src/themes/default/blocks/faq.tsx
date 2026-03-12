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
        'bg-[#f8f8f9] py-24 md:py-32',
        section.className,
        className
      )}
    >
      <div className="container mx-auto max-w-5xl px-4">
        <ScrollAnimation>
          <div className="mx-auto max-w-3xl text-center text-balance">
            <h2 className="mx-auto max-w-4xl text-[40px] font-medium tracking-tighter text-balance text-zinc-950 md:text-[42px]">
              {section.title}
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-3xl md:text-xl/relaxed">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mx-auto mt-12 max-w-4xl rounded-[1.75rem] border border-zinc-200 bg-zinc-50/80 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <Accordion type="single" collapsible className="w-full">
              {section.items?.map((item, idx) => (
                <div className="group" key={idx}>
                  <AccordionItem
                    value={item.question || item.title || ''}
                    className="peer rounded-[1.1rem] border-none px-5 py-1 data-[state=open]:bg-white"
                  >
                    <AccordionTrigger
                      id={`faq-trigger-${idx + 1}`}
                      aria-controls={`faq-content-${idx + 1}`}
                      className="cursor-pointer text-left text-base font-medium text-zinc-950 hover:no-underline"
                    >
                      {item.question || item.title || ''}
                    </AccordionTrigger>
                    <AccordionContent
                      id={`faq-content-${idx + 1}`}
                      aria-labelledby={`faq-trigger-${idx + 1}`}
                    >
                      <p className="text-base leading-7 text-zinc-500">
                        {item.answer || item.description || ''}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <hr className="mx-5 border-zinc-200 group-last:hidden peer-data-[state=open]:opacity-0" />
                </div>
              ))}
            </Accordion>

            <p
              className="text-muted-foreground px-6 pt-4 pb-5 text-sm leading-6"
              dangerouslySetInnerHTML={{ __html: section.tip || '' }}
            />
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
