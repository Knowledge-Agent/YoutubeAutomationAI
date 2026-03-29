'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

import { AssistantModelOption } from './types';

interface AssistantModelPickerProps {
  label?: string;
  models: AssistantModelOption[];
  selectedModelId?: string;
  onSelect: (modelId: string) => void;
  triggerClassName?: string;
  compact?: boolean;
  showTriggerLabel?: boolean;
  showTriggerMeta?: boolean;
  testIdPrefix?: string;
}

function groupModels(models: AssistantModelOption[]) {
  return models.reduce<Record<string, AssistantModelOption[]>>((groups, model) => {
    const groupName = model.providerLabel ?? model.provider;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(model);
    return groups;
  }, {});
}

function toTestIdToken(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AssistantModelPicker({
  label = 'Model',
  models,
  selectedModelId,
  onSelect,
  triggerClassName,
  compact = false,
  showTriggerLabel = false,
  showTriggerMeta = false,
  testIdPrefix,
}: AssistantModelPickerProps) {
  const [open, setOpen] = useState(false);
  const groupedModels = useMemo(() => groupModels(models), [models]);
  const selectedModel = models.find((model) => model.id === selectedModelId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex h-11 items-center gap-3 rounded-[16px] border border-white/8 bg-[#262734] px-4 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[#2d2e3b]',
            compact && 'h-10 rounded-xl px-3 text-[13px]',
            triggerClassName
          )}
          data-testid={
            testIdPrefix ? `${testIdPrefix}-trigger` : undefined
          }
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#11131a] text-[11px] font-semibold text-cyan-300">
            {(selectedModel?.providerLabel ?? selectedModel?.provider ?? 'A')
              .charAt(0)
              .toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 text-left">
            {showTriggerLabel ? (
              <span
                className={cn(
                  'mb-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500',
                  compact && 'hidden'
                )}
              >
                {label}
              </span>
            ) : null}
            <span className="block truncate">
              {selectedModel?.label ?? `Select ${label.toLowerCase()}`}
            </span>
            {showTriggerMeta && selectedModel?.meta ? (
              <span
                className={cn(
                  'mt-1 block truncate text-[11px] font-normal text-zinc-500',
                  compact && 'hidden'
                )}
              >
                {selectedModel.meta}
              </span>
            ) : null}
          </span>
          <ChevronDown className="size-4 text-zinc-400" />
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl border-white/10 bg-[#171821] p-0 text-white"
        data-testid={testIdPrefix ? `${testIdPrefix}-dialog` : undefined}
      >
        <DialogHeader className="border-b border-white/8 px-6 py-5">
          <div className="text-sm font-medium text-zinc-500">{label}</div>
          <DialogTitle className="mt-1 text-2xl tracking-tight text-white">
            Select a model
          </DialogTitle>
        </DialogHeader>
        <Command className="bg-transparent">
          <div className="border-b border-white/8 px-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-zinc-400">
              <Search className="size-4" />
              <CommandInput
                className="h-auto border-none bg-transparent p-0 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-0"
                data-testid={
                  testIdPrefix ? `${testIdPrefix}-search` : undefined
                }
                placeholder="Search models"
              />
            </div>
          </div>
          <CommandList className="max-h-[540px] px-4 py-4">
            <CommandEmpty className="rounded-2xl border border-dashed border-white/8 bg-white/5 px-4 py-8 text-center text-sm text-zinc-500">
              No models found.
            </CommandEmpty>
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <CommandGroup
                key={provider}
                heading={provider}
                className="mb-4 rounded-[24px] border border-white/8 bg-[#1d1f29] p-3 text-zinc-400"
              >
                <div className="space-y-2">
                  {providerModels.map((model) => {
                    const active = model.id === selectedModelId;

                    return (
                      <CommandItem
                        key={model.id}
                        onSelect={() => {
                          onSelect(model.id);
                          setOpen(false);
                        }}
                        className={cn(
                          'flex items-start gap-3 rounded-[20px] border border-white/8 bg-white/5 px-4 py-4 text-left text-white data-[selected=true]:bg-white/10',
                          active && 'border-white/16 bg-white/10'
                        )}
                        data-testid={
                          testIdPrefix
                            ? `${testIdPrefix}-option-${toTestIdToken(model.id)}`
                            : undefined
                        }
                      >
                        <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#10131a] text-xs font-semibold text-cyan-300">
                          {(model.providerLabel ?? model.provider)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-white">
                              {model.label}
                            </span>
                            {model.badge ? (
                              <Badge className="border-none bg-lime-400/90 px-2 py-0.5 text-[10px] text-[#102100]">
                                {model.badge}
                              </Badge>
                            ) : null}
                            {model.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="border-white/8 bg-black/20 px-2 py-0.5 text-[10px] text-zinc-300"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          {model.description ? (
                            <p className="mt-1 text-xs leading-5 text-zinc-400">
                              {model.description}
                            </p>
                          ) : null}
                          {model.meta ? (
                            <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                              {model.meta}
                            </div>
                          ) : null}
                        </div>
                        <div className="pt-1 text-zinc-200">
                          {active ? <Check className="size-4" /> : null}
                        </div>
                      </CommandItem>
                    );
                  })}
                </div>
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
