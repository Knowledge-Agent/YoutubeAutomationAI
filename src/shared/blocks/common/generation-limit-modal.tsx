'use client';

import { AlertTriangle } from 'lucide-react';

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
      <DialogContent className="border-white/8 bg-[#171821] text-white sm:max-w-[420px]">
        <DialogHeader>
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/12 text-amber-300">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle>{generationLimitModal.title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {generationLimitModal.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={hideGenerationLimitModal}
            className="bg-white text-zinc-950 hover:bg-zinc-100"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
