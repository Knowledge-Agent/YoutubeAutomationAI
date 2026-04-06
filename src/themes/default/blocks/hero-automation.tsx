'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { ArrowUp, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';

import {
  FloatingParticles,
  type FloatingParticle,
} from '@/shared/components/ui/floating-particles';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

const decorativeDots: FloatingParticle[] = [
  { left: '5%', top: '14%', size: '2px', duration: '21s', delay: '-2s' },
  { left: '18%', top: '8%', size: '2.5px', duration: '17s', delay: '-6s' },
  { left: '30%', top: '22%', size: '3px', duration: '20s', delay: '-11s' },
  { left: '43%', top: '13%', size: '2px', duration: '16s', delay: '-4s' },
  { left: '54%', top: '28%', size: '3px', duration: '19s', delay: '-8s' },
  { left: '69%', top: '18%', size: '2px', duration: '22s', delay: '-13s' },
  { left: '87%', top: '20%', size: '2.5px', duration: '18s', delay: '-9s' },
  { left: '13%', top: '48%', size: '2px', duration: '20s', delay: '-15s' },
  { left: '46%', top: '57%', size: '1.5px', duration: '14s', delay: '-5s' },
  { left: '63%', top: '52%', size: '2px', duration: '23s', delay: '-10s' },
  { left: '78%', top: '44%', size: '3px', duration: '17s', delay: '-7s' },
  { left: '92%', top: '60%', size: '2px', duration: '19s', delay: '-12s' },
  {
    left: '9%',
    top: '24%',
    size: '4px',
    duration: '28s',
    delay: '-6s',
    opacity: 0.14,
    blur: '0.2px',
    variant: 'drift',
  },
  {
    left: '58%',
    top: '36%',
    size: '4px',
    duration: '31s',
    delay: '-12s',
    opacity: 0.16,
    blur: '0.2px',
    variant: 'drift',
  },
  {
    left: '84%',
    top: '66%',
    size: '3.5px',
    duration: '26s',
    delay: '-18s',
    opacity: 0.14,
    blur: '0.2px',
    variant: 'drift',
  },
  {
    left: '24%',
    top: '78%',
    size: '3px',
    duration: '30s',
    delay: '-10s',
    opacity: 0.12,
    variant: 'drift',
  },
];

const inputParticles: FloatingParticle[] = [
  {
    left: '8%',
    top: '20%',
    size: '3px',
    duration: '11s',
    delay: '-3s',
    opacity: 0.24,
  },
  {
    left: '18%',
    top: '74%',
    size: '2.5px',
    duration: '14s',
    delay: '-7s',
    opacity: 0.18,
    variant: 'drift',
  },
  {
    left: '31%',
    top: '12%',
    size: '3px',
    duration: '12s',
    delay: '-5s',
    opacity: 0.22,
  },
  {
    left: '44%',
    top: '82%',
    size: '2px',
    duration: '10s',
    delay: '-6s',
    opacity: 0.16,
    variant: 'drift',
  },
  {
    left: '58%',
    top: '18%',
    size: '3.5px',
    duration: '13s',
    delay: '-9s',
    opacity: 0.2,
  },
  {
    left: '71%',
    top: '76%',
    size: '2.5px',
    duration: '15s',
    delay: '-2s',
    opacity: 0.18,
    variant: 'drift',
  },
  {
    left: '86%',
    top: '28%',
    size: '3px',
    duration: '12s',
    delay: '-4s',
    opacity: 0.24,
  },
];

export function HeroAutomation({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const submitLockRef = useRef(false);

  const accentText =
    typeof section.title_emphasis === 'string' ? section.title_emphasis : '';
  const titleParts =
    accentText && section.title?.includes(accentText)
      ? section.title.split(accentText, 2)
      : null;
  const placeholderExamples = useMemo(
    () =>
      Array.isArray(section.prompt_examples) &&
      section.prompt_examples.length > 0
        ? section.prompt_examples
        : [
            'founder@yourchannel.com',
            'creator@yourbrand.ai',
            'team@facelessstudio.co',
          ],
    [section.prompt_examples]
  );

  useEffect(() => {
    if (email) {
      setPlaceholderText('');
      return;
    }

    let exampleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = placeholderExamples[exampleIndex] || '';

      if (!deleting) {
        charIndex += 1;
        setPlaceholderText(current.slice(0, charIndex));
        if (charIndex >= current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex -= 1;
        setPlaceholderText(current.slice(0, Math.max(0, charIndex)));
        if (charIndex <= 0) {
          deleting = false;
          exampleIndex = (exampleIndex + 1) % placeholderExamples.length;
        }
      }

      timeoutId = setTimeout(tick, deleting ? 36 : 62);
    };

    timeoutId = setTimeout(tick, 300);
    return () => clearTimeout(timeoutId);
  }, [email, placeholderExamples]);

  const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitLockRef.current) {
      return;
    }

    const trimmed = email.trim().toLowerCase();
    const action = section.submit?.action;

    if (!action) return;
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
        'landing-shell relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden pt-20 pb-8 md:pt-24 md:pb-10',
        section.className,
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_16%,rgba(255,122,26,0.18),transparent_22%),radial-gradient(circle_at_82%_18%,rgba(30,184,166,0.14),transparent_22%),linear-gradient(180deg,#faf6f0_0%,#f6f3ee_48%,#f0ebe2_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(23,24,28,0.12)_1.15px,transparent_0)] bg-[length:180px_180px] opacity-55" />
      <FloatingParticles particles={decorativeDots} className="-z-10" />

      {section.background_image?.src && (
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[26rem] overflow-hidden md:block">
          <Image
            src={section.background_image.src}
            alt={section.background_image.alt || ''}
            className="object-cover opacity-[0.03]"
            fill
            sizes="100vw"
            quality={70}
            unoptimized={section.background_image.src.startsWith('http')}
          />
        </div>
      )}

      <div className="relative z-10 container w-full">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="landing-title mx-auto max-w-4xl text-4xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[3.35rem] lg:text-[3.75rem]">
              {titleParts ? (
                <>
                  {titleParts[0]}
                  <span className="bg-linear-to-br from-[#6f4322] via-[var(--brand-signal)] to-[#ffb067] bg-clip-text text-transparent">
                    {accentText}
                  </span>
                  {titleParts[1]}
                </>
              ) : (
                section.title
              )}
            </h1>

            <p
              className="landing-copy mx-auto mt-4 max-w-2xl text-base leading-7 tracking-tight text-balance md:text-[1.05rem] md:leading-8"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />
          </div>

          <div className="relative mx-auto mt-7 max-w-4xl md:mt-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-14 -top-6 -bottom-6 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgba(164,180,255,0.28),transparent_62%)] blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-1/2 -z-10 h-28 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(193,206,255,0.22),transparent_68%)] blur-3xl"
            />
            <FloatingParticles
              particles={inputParticles}
              className="inset-x-8 -top-4 -bottom-4 -z-10"
            />
            <form
              className="landing-surface relative overflow-hidden rounded-[2rem] border shadow-[0_24px_60px_rgba(23,24,28,0.08)]"
              onSubmit={handleWaitlistSubmit}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,122,26,0.1),transparent_22%),radial-gradient(circle_at_82%_24%,rgba(30,184,166,0.08),transparent_18%)]"
              />

              <div className="relative flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5">
                <label htmlFor="hero-email-surface" className="sr-only">
                  Waitlist email
                </label>

                <div className="landing-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-full border shadow-xs">
                  <Mail className="size-4" />
                </div>

                <div className="relative min-w-0 flex-1">
                  {!email && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 left-0 flex items-center">
                      <span className="landing-copy truncate text-base font-medium tracking-tight sm:text-lg">
                        {placeholderText ||
                          section.prompt_placeholder ||
                          'Enter your email to join the waitlist'}
                      </span>
                      <span className="type-caret ml-0.5 inline-block h-6 w-px shrink-0 bg-[color:var(--landing-muted)]" />
                    </div>
                  )}
                  <input
                    id="hero-email-surface"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder=""
                    className="landing-title relative z-10 h-12 w-full appearance-none border-none bg-transparent p-0 text-base leading-8 font-medium tracking-tight caret-[var(--brand-signal)] shadow-none outline-none focus:ring-0 focus:outline-none sm:text-lg"
                    style={{
                      backgroundColor: 'transparent',
                      WebkitBoxShadow: '0 0 0 1000px transparent inset',
                      boxShadow: 'none',
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  aria-label={section.prompt_button_label || 'Join waitlist'}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-signal)] text-white shadow-lg shadow-[rgba(229,106,17,0.22)] transition hover:bg-[var(--brand-signal-strong)] disabled:cursor-not-allowed disabled:bg-[#d9c5b0]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUp className="size-4" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
