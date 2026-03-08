'use client';

import Image from 'next/image';
import { useEffect, useState, type FormEvent } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function HeroAutomation({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const keyPoints = Array.isArray(section.key_points)
    ? section.key_points.filter(Boolean)
    : [];
  const socialProof = Array.isArray(section.social_proof)
    ? section.social_proof.filter(Boolean)
    : [];
  const metrics = Array.isArray(section.metrics) ? section.metrics : [];
  const workflowSteps = Array.isArray(section.workflow_steps)
    ? section.workflow_steps
    : [];

  useEffect(() => {
    const syncWaitlistState = () => {
      const hash = window.location.hash.replace('#', '');
      setWaitlistOpen(hash === 'hero-waitlist' || hash === 'join-waitlist');
    };

    syncWaitlistState();
    window.addEventListener('hashchange', syncWaitlistState);

    return () => {
      window.removeEventListener('hashchange', syncWaitlistState);
    };
  }, []);

  const updateWaitlistOpen = (open: boolean) => {
    setWaitlistOpen(open);

    if (typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);
    if (open) {
      url.hash = 'hero-waitlist';
    } else if (
      url.hash === '#hero-waitlist' ||
      url.hash === '#join-waitlist'
    ) {
      url.hash = '';
    }

    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const handleWaitlistSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      updateWaitlistOpen(false);
      toast.success(message || 'Thanks! You are on the waitlist.');
    } catch (error: any) {
      toast.error(error?.message || 'submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id={section.id}
      className={cn(
        'relative flex min-h-screen overflow-hidden bg-[#060816] pt-24 pb-10 text-white md:pt-32',
        section.className,
        className
      )}
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.22),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#050816_0%,_#090d1f_45%,_#04060f_100%)]" />

      {section.background_image?.src && (
        <div className="absolute inset-0 -z-10 hidden overflow-hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-b from-[#060816]/70 via-[#060816]/88 to-[#060816]" />
          <Image
            src={section.background_image.src}
            alt={section.background_image.alt || ''}
            className="object-cover opacity-25"
            fill
            sizes="100vw"
            quality={70}
            unoptimized={section.background_image.src.startsWith('http')}
          />
        </div>
      )}

      <div className="relative z-10 container flex flex-1 flex-col justify-center">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="mx-auto max-w-4xl text-center">
            {section.label && (
              <span className="mb-5 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-300">
                {section.label}
              </span>
            )}

            <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl md:text-6xl">
              {section.title}
            </h1>

            <p
              className="mx-auto mt-6 max-w-3xl text-base leading-7 text-pretty text-slate-300 sm:text-lg"
              dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
            />

            {section.buttons && section.buttons.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                {section.buttons.map((button, idx) => {
                  const isWaitlistButton = (button.url || '').includes(
                    '#hero-waitlist'
                  );

                  return (
                    <Button
                      key={idx}
                      size={button.size || 'lg'}
                      variant={button.variant || 'default'}
                      className={cn(
                        'h-12 rounded-xl px-6 text-sm',
                        idx === 0 &&
                          'bg-primary text-primary-foreground hover:bg-primary/90 border-[0.5px] border-white/25 shadow-md ring-1 shadow-black/20 ring-(--ring-color) [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))]'
                      )}
                      asChild={!isWaitlistButton}
                      onClick={
                        isWaitlistButton
                          ? () => updateWaitlistOpen(true)
                          : undefined
                      }
                    >
                      {isWaitlistButton ? (
                        <>
                          {button.icon && (
                            <SmartIcon
                              name={button.icon as string}
                              className="size-4"
                            />
                          )}
                          <span>{button.title}</span>
                        </>
                      ) : (
                        <Link
                          href={button.url ?? ''}
                          target={button.target ?? '_self'}
                        >
                          {button.icon && (
                            <SmartIcon
                              name={button.icon as string}
                              className="size-4"
                            />
                          )}
                          <span>{button.title}</span>
                        </Link>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}

            {section.submit?.action && (
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                Click <span className="font-semibold text-orange-300">Join Waitlist</span>{' '}
                to leave your email and get early-access invites.
              </p>
            )}

            {socialProof.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {socialProof.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-300">
                <ArrowRight className="size-4" />
                <span>{section.workflow_label || 'Workflow Blueprint'}</span>
              </div>

              {section.workflow_title && (
                <h2 className="mt-4 max-w-3xl text-2xl leading-tight font-semibold text-white md:text-3xl xl:max-w-2xl">
                  {section.workflow_title}
                </h2>
              )}

              {workflowSteps.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {workflowSteps.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex h-full min-h-[180px] flex-col rounded-2xl border border-white/10 bg-slate-950/50 p-5 xl:p-6"
                    >
                      <div className="mb-3 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                        Step {idx + 1}
                      </div>
                      <div className="flex flex-1 flex-col gap-4">
                        {step.icon && (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-orange-300">
                            <SmartIcon
                              name={step.icon as string}
                              className="size-4"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <p className="text-base leading-snug font-semibold text-white">
                            {step.title}
                          </p>
                          <p className="text-sm leading-6 text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid content-start gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur md:p-8">
                {section.audience && (
                  <p className="text-sm font-medium text-orange-300">
                    {section.audience}
                  </p>
                )}

                {keyPoints.length > 0 && (
                  <ul className="mt-4 space-y-3 xl:max-w-xl">
                    {keyPoints.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-400" />
                        <span className="text-sm leading-6 text-slate-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {metrics.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {metrics.map((metric: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                    >
                      <p className="text-3xl font-semibold text-white">
                        {metric.value || metric.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {metric.label || metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={waitlistOpen} onOpenChange={updateWaitlistOpen}>
        <DialogContent className="border-white/10 bg-[#0b1126] p-0 text-white shadow-2xl sm:max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_38%),linear-gradient(180deg,_rgba(11,17,38,1)_0%,_rgba(8,12,28,1)_100%)] p-6 sm:p-8">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-semibold text-white">
                {section.submit?.button?.title || 'Join Waitlist'}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-slate-400">
                Get early access to the long-video-to-shorts workflow. Leave your email and we will send invites in batches.
              </DialogDescription>
            </DialogHeader>

            <form className="mt-6 space-y-4" onSubmit={handleWaitlistSubmit}>
              <label htmlFor="hero-waitlist-email" className="sr-only">
                Email address
              </label>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur has-[input:focus]:ring-2 has-[input:focus]:ring-orange-400/40">
                <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4 text-slate-400" />
                <input
                  id="hero-waitlist-email"
                  type="email"
                  name="email"
                  required
                  aria-required="true"
                  placeholder={
                    section.submit?.input?.placeholder ||
                    'Enter your email for early access'
                  }
                  className="h-12 w-full bg-transparent pr-4 pl-11 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {section.submit?.hint && (
                <p
                  className="text-sm leading-6 text-slate-400"
                  dangerouslySetInnerHTML={{ __html: section.submit.hint }}
                />
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 border-[0.5px] border-white/25 px-6 shadow-md ring-1 shadow-black/20 ring-(--ring-color) [--ring-color:color-mix(in_oklab,var(--color-foreground)15%,var(--color-primary))]"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>{section.submit?.button?.title || 'Join Waitlist'}</span>
                    <SendHorizonal className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
