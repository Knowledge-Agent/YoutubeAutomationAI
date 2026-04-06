'use client';

import { useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Mail,
  SendHorizonal,
} from 'lucide-react';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { Highlighter } from '@/shared/components/ui/highlighter';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { SocialAvatars } from './social-avatars';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  const highlightText = section.highlight_text ?? '';
  let texts = null;
  if (highlightText) {
    texts = section.title?.split(highlightText, 2);
  }

  const keyPoints = Array.isArray(section.key_points)
    ? section.key_points.filter(Boolean)
    : [];
  const socialProof = Array.isArray(section.social_proof)
    ? section.social_proof.filter(Boolean)
    : [];
  const proofBullets = Array.isArray(section.proof_card?.bullets)
    ? section.proof_card.bullets.filter(Boolean)
    : [];
  const heroMetrics = Array.isArray(section.metrics)
    ? section.metrics.filter(Boolean)
    : [];

  const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const action = section.submit?.action;

    if (!action) {
      return;
    }

    if (!trimmed) {
      toast.error('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      submitLockRef.current = true;
      setSubmitting(true);

      const pagePath =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '';

      const resp = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmed,
          source: section.id || 'homepage_waitlist',
          pagePath,
          locale:
            typeof navigator !== 'undefined' ? navigator.language || '' : '',
        }),
      });

      if (!resp.ok) {
        throw new Error(`request failed with status ${resp.status}`);
      }

      const { code, message } = await resp.json();
      if (code !== 0) {
        throw new Error(message || 'request failed');
      }

      setEmail('');
      toast.success(message || 'Thanks! You are on the waitlist.');
    } catch (error: any) {
      toast.error(error?.message || 'submit failed');
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <section
      id={section.id}
      className={cn(
        `pt-24 pb-8 md:pt-36 md:pb-8`,
        section.className,
        className
      )}
    >
      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="landing-surface group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-[rgba(23,24,28,0.05)] transition-colors duration-300 hover:bg-[var(--landing-hover)]"
        >
          <span className="landing-title text-sm">
            {section.announcement.title}
          </span>
          <span className="block h-4 w-px bg-[color:var(--landing-line)]"></span>

          <div className="size-6 overflow-hidden rounded-full bg-[var(--landing-canvas)] duration-500 group-hover:bg-[var(--landing-hover-strong)]">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-card border-border/80 rounded-3xl border p-6 shadow-sm md:p-10">
            {section.label && (
              <p className="text-primary bg-primary/10 mb-4 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
                {section.label}
              </p>
            )}

            {texts && texts.length > 0 ? (
              <h1 className="text-foreground text-left font-sans text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl">
                {texts[0]}
                <Highlighter action="underline" color="#FF7A1A">
                  {highlightText}
                </Highlighter>
                {texts[1]}
              </h1>
            ) : (
              <h1 className="text-foreground text-left font-sans text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl">
                {section.title}
              </h1>
            )}

            <p
              className="text-muted-foreground mt-5 max-w-2xl text-left text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />

            {section.audience && (
              <p
                className="text-foreground mt-4 text-left text-sm font-medium"
                dangerouslySetInnerHTML={{ __html: section.audience }}
              />
            )}

            {section.submit?.action && (
              <form className="mt-6 max-w-2xl" onSubmit={handleWaitlistSubmit}>
                <label htmlFor="hero-email" className="sr-only">
                  Email
                </label>
                <div className="bg-background/95 has-[input:focus]:ring-primary/30 relative grid grid-cols-[1fr_auto] items-center overflow-hidden rounded-2xl border pr-2 shadow-sm has-[input:focus]:ring-2">
                  <Mail className="text-muted-foreground pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />
                  <input
                    id="hero-email"
                    type="email"
                    name="email"
                    required
                    aria-required="true"
                    placeholder={
                      section.submit?.input?.placeholder ||
                      'Enter your email for early access'
                    }
                    className="h-12 w-full bg-transparent pr-3 pl-10 text-sm focus:outline-none md:h-13"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl px-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <span className="hidden sm:inline">
                          {section.submit?.button?.title || 'Join Waitlist'}
                        </span>
                        <SendHorizonal className="size-4 sm:hidden" />
                      </>
                    )}
                  </Button>
                </div>
                {section.submit?.hint && (
                  <p
                    className="text-muted-foreground mt-2 text-left text-sm"
                    dangerouslySetInnerHTML={{ __html: section.submit.hint }}
                  />
                )}
              </form>
            )}

            {keyPoints.length > 0 && (
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {keyPoints.map((point: string, idx: number) => (
                  <li
                    key={idx}
                    className="border-border/70 bg-muted/40 flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm"
                  >
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-foreground/90">{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {heroMetrics.length > 0 && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {heroMetrics.map(
                  (
                    metric: {
                      value?: string;
                      title?: string;
                      label?: string;
                      description?: string;
                    },
                    idx: number
                  ) => (
                    <div
                      key={idx}
                      className="bg-background/80 border-border/70 rounded-xl border px-3 py-2"
                    >
                      <p className="text-foreground text-lg leading-none font-semibold">
                        {metric.value || metric.title}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        {metric.label || metric.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {socialProof.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {socialProof.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-muted-foreground bg-muted inline-flex rounded-full px-3 py-1 text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            {section.buttons && (
              <div className="mt-6 flex flex-wrap items-center justify-start gap-4">
                {section.buttons.map((button, idx) => (
                  <Button
                    asChild
                    size={button.size || 'default'}
                    variant={button.variant || 'default'}
                    className="px-4 text-sm"
                    key={idx}
                  >
                    <Link
                      href={button.url ?? ''}
                      target={button.target ?? '_self'}
                    >
                      {button.icon && (
                        <SmartIcon name={button.icon as string} />
                      )}
                      <span>{button.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            )}

            {section.tip && (
              <p
                className="text-muted-foreground mt-6 block text-left text-sm"
                dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
              />
            )}
          </div>

          <aside className="bg-background border-border/80 rounded-3xl border p-6 shadow-sm md:p-8">
            {section.proof_card?.title && (
              <p className="text-foreground text-lg font-semibold">
                {section.proof_card.title}
              </p>
            )}

            {section.proof_card?.quote && (
              <blockquote
                className="text-foreground/90 border-l-primary/60 mt-4 border-l-2 pl-4 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: section.proof_card.quote }}
              />
            )}

            {proofBullets.length > 0 && (
              <ul className="mt-6 space-y-3">
                {proofBullets.map((bullet: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                    <span className="text-foreground/90 text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.proof_card?.note && (
              <p
                className="text-muted-foreground border-border/70 bg-muted/30 mt-6 rounded-xl border p-3 text-sm"
                dangerouslySetInnerHTML={{ __html: section.proof_card.note }}
              />
            )}
          </aside>
        </div>

        {section.show_avatars && (
          <SocialAvatars tip={section.avatars_tip || ''} />
        )}
      </div>

      {(section.image?.src || section.image_invert?.src) && (
        <div className="border-foreground/10 relative mt-8 border-y sm:mt-16">
          <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
            <div className="border-x">
              <div
                aria-hidden
                className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
              />
              {section.image_invert?.src && (
                <Image
                  className="border-border/25 relative z-2 hidden w-full border dark:block"
                  src={section.image_invert.src}
                  alt={section.image_invert.alt || section.image?.alt || ''}
                  width={
                    section.image_invert.width || section.image?.width || 1200
                  }
                  height={
                    section.image_invert.height || section.image?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                  unoptimized={section.image_invert.src.startsWith('http')}
                />
              )}
              {section.image?.src && (
                <Image
                  className="border-border/25 relative z-2 block w-full border dark:hidden"
                  src={section.image.src}
                  alt={section.image.alt || section.image_invert?.alt || ''}
                  width={
                    section.image.width || section.image_invert?.width || 1200
                  }
                  height={
                    section.image.height || section.image_invert?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                  unoptimized={section.image.src.startsWith('http')}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {section.background_image?.src && (
        <div className="absolute inset-0 -z-10 hidden h-full w-full overflow-hidden md:block">
          <div className="from-background/80 via-background/80 to-background absolute inset-0 z-10 bg-gradient-to-b" />
          <Image
            src={section.background_image.src}
            alt={section.background_image.alt || ''}
            className="object-cover opacity-60 blur-[0px]"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 0vw, 100vw"
            quality={70}
            unoptimized={section.background_image.src.startsWith('http')}
          />
        </div>
      )}
    </section>
  );
}
