'use client';

import { Clock3 } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAppContext } from '@/shared/contexts/app';

export function GenerationLimitModal() {
  const { generationLimitModal, hideGenerationLimitModal } = useAppContext();

  return (
    <Dialog
      open={generationLimitModal.open}
      onOpenChange={(open) => {
        if (!open) {
          hideGenerationLimitModal();
        }
      }}
    >
      <DialogContent className="overflow-hidden border-white/8 bg-[#171821] p-0 text-white shadow-[0_32px_90px_rgba(0,0,0,0.52)] sm:max-w-[470px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,26,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_22%)]" />
        <div className="relative">
          <div className="border-b border-white/8 px-6 py-5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-signal-soft)] bg-[color:var(--brand-signal-soft)] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[var(--brand-signal)] uppercase">
              <Clock3 className="size-3.5" />
              Daily Usage Reminder
            </div>
            <DialogHeader className="space-y-0 text-left">
              <DialogTitle className="text-[1.55rem] font-semibold tracking-[-0.04em] text-white">
                {generationLimitModal.title}
              </DialogTitle>
              <DialogDescription className="mt-3 text-[15px] leading-7 text-zinc-300">
                {generationLimitModal.description}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-5">
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={hideGenerationLimitModal}
                className="h-11 rounded-full bg-white px-5 text-zinc-950 hover:bg-zinc-100"
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
