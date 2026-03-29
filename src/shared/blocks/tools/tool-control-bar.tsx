'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  ImageIcon,
  Monitor,
  MoreHorizontal,
  Sparkles,
  Video,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useToolCatalog } from '@/shared/hooks/use-tool-catalog';
import { AI_CREDITS_ENABLED } from '@/shared/lib/ai-credits';
import { cn } from '@/shared/lib/utils';
import { getToolOptionDefinition } from '@/shared/services/apimart/catalog';
import type {
  ToolMode,
  ToolModelDefinition,
  ToolOptionDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

type ToolControlSurface = Exclude<ToolSurface, 'chat'>;

export type ToolControlValue = {
  mode: ToolMode | string;
  modelId: string;
  options: Record<string, unknown>;
};

type SpecChip = {
  key: string;
  label: string;
  icon?: typeof Monitor;
};

const SUPPORTED_CONTROL_MODES = new Set<ToolMode>([
  'text-to-image',
  'image-to-image',
  'text-to-video',
  'image-to-video',
]);

const PRIMARY_OPTION_KEYS: Record<ToolControlSurface, string[]> = {
  image: ['size'],
  video: ['aspect_ratio', 'duration', 'resolution'],
};

const STUDIO_COMMAND_BASE =
  'inline-flex h-10 items-center gap-2 rounded-[13px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] px-3 text-[12px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]';
const STUDIO_COMMAND_INTERACTIVE = `${STUDIO_COMMAND_BASE} transition hover:border-white/14 hover:bg-[var(--studio-hover-strong)]`;
const STUDIO_ICON_COMMAND =
  'inline-flex h-10 w-10 items-center justify-center rounded-[13px] border border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)] text-[var(--studio-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]';
const STUDIO_ICON_COMMAND_INTERACTIVE = `${STUDIO_ICON_COMMAND} transition hover:border-white/14 hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]`;
const STUDIO_DROPDOWN =
  'border-[color:var(--studio-line)] bg-[rgb(23_25_32_/_0.98)] text-[var(--studio-ink)] shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl';

function getModeLabel(mode: ToolMode) {
  switch (mode) {
    case 'text-to-image':
      return 'Text to Image';
    case 'image-to-image':
      return 'Image to Image';
    case 'text-to-video':
      return 'Text to Video';
    case 'image-to-video':
      return 'Image to Video';
    default:
      return mode;
  }
}

function getModeDescription(mode: ToolMode) {
  switch (mode) {
    case 'text-to-image':
      return 'Generate original images from text prompts';
    case 'image-to-image':
      return 'Reference an image and restyle or improve it';
    case 'text-to-video':
      return 'Turn text prompts into short video clips';
    case 'image-to-video':
      return 'Animate a reference image into a short clip';
    default:
      return '';
  }
}

function getOptionDescription(option: ToolOptionDefinition | undefined) {
  if (!option) {
    return '';
  }

  if (option.description) {
    return option.description;
  }

  switch (option.key) {
    case 'audio':
      return 'Generate synchronized audio when the selected model supports it';
    case 'n':
      return 'Number of outputs created in a single run';
    case 'style':
      return 'Apply the provider-specific visual style system';
    case 'thumbnail':
      return 'Generate a thumbnail alongside the main output';
    case 'watermark':
      return 'Include a provider watermark in the result';
    default:
      return '';
  }
}

function getModelFamily(model: ToolModelDefinition) {
  return (
    model.ui?.family ?? {
      key: model.provider,
      label: model.label,
      description: 'APIMart model',
    }
  );
}

function getModelMark(model: ToolModelDefinition) {
  return model.ui?.mark ?? model.label.charAt(0).toUpperCase();
}

function getModelTags(model: ToolModelDefinition) {
  return model.ui?.tags ?? [];
}

function getTagClassName(tone?: 'accent' | 'muted' | 'success') {
  switch (tone) {
    case 'accent':
      return 'border-[color:var(--brand-signal-soft)] bg-[color:var(--brand-signal-soft)] text-[var(--brand-signal)]';
    case 'success':
      return 'border-[rgba(30,184,166,0.24)] bg-[var(--image-accent)] text-[#08201d]';
    case 'muted':
    default:
      return 'border-[color:var(--studio-line)] bg-[rgba(255,255,255,0.04)] text-[var(--studio-muted)]';
  }
}

function getFamilyGlyph(key: string) {
  switch (key) {
    case 'veo':
      return 'G';
    case 'sora':
      return 'S';
    case 'wan':
      return 'W';
    case 'kling':
      return 'K';
    case 'seedance':
      return 'Se';
    case 'hailuo':
      return 'H';
    default:
      return key.charAt(0).toUpperCase();
  }
}

function getFamilyGlyphClassName(key: string, active: boolean) {
  const tone = (() => {
    switch (key) {
      case 'veo':
        return 'text-[#7dd8ff]';
      case 'sora':
        return 'text-[var(--brand-signal)]';
      case 'wan':
        return 'text-[#f2d28a]';
      case 'kling':
        return 'text-[var(--studio-ink)]';
      case 'seedance':
        return 'text-[var(--image-accent)]';
      case 'hailuo':
        return 'text-[var(--video-accent)]';
      default:
        return 'text-[var(--brand-signal)]';
    }
  })();

  return cn(
    'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border bg-[#0b0d12] text-[16px] font-semibold tracking-tight shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
    active ? 'border-white/14' : 'border-[color:var(--studio-line)]',
    tone
  );
}

function getFamilyBadgeClassName(badge?: string) {
  if (badge === 'New') {
    return 'border-[color:var(--brand-signal-soft)] bg-[color:var(--brand-signal-soft)] text-[var(--brand-signal)]';
  }

  return 'border-[color:var(--studio-line)] bg-[#111218] text-[var(--studio-ink)]';
}

function resolveOptionLabel(
  option: ToolOptionDefinition | undefined,
  value: unknown
) {
  if (!option) {
    return '';
  }

  const nextValue =
    value === undefined || value === null || value === ''
      ? option.defaultValue
      : value;
  const normalized = String(nextValue ?? '');

  return (
    option.options?.find((choice) => choice.value === normalized)?.label ??
    normalized
  );
}

function getMergedOptionDefinition(
  optionDefinitions: Record<string, ToolOptionDefinition>,
  model: ToolModelDefinition | undefined,
  key: string
) {
  const option = optionDefinitions[key];
  if (!option) {
    return undefined;
  }

  const merged = getToolOptionDefinition(key, model);
  return merged ?? option;
}

function normalizeSelectOptionValue(
  option: ToolOptionDefinition | undefined,
  value: unknown
) {
  if (!option || option.type !== 'select' || !option.options?.length) {
    return value;
  }

  const normalizedValue =
    value === undefined || value === null || value === ''
      ? option.defaultValue
      : value;

  if (
    normalizedValue === undefined ||
    option.options.some((choice) => choice.value === String(normalizedValue))
  ) {
    return normalizedValue;
  }

  return option.defaultValue;
}

function buildSpecsChips({
  surface,
  model,
  options,
  optionDefinitions,
}: {
  surface: ToolControlSurface;
  model: ToolModelDefinition | undefined;
  options: Record<string, unknown>;
  optionDefinitions: Record<string, ToolOptionDefinition>;
}) {
  const primaryKeys = PRIMARY_OPTION_KEYS[surface].filter((key) =>
    model?.supportedOptions.includes(key)
  );

  return primaryKeys
    .map<SpecChip | null>((key) => {
      const option = getMergedOptionDefinition(optionDefinitions, model, key);
      const label = resolveOptionLabel(option, options[key]);

      if (!label) {
        return null;
      }

      if (key === 'aspect_ratio') {
        return { key, label, icon: Monitor };
      }

      if (key === 'duration') {
        return { key, label, icon: Clock3 };
      }

      return { key, label };
    })
    .filter(Boolean) as SpecChip[];
}

export function normalizeToolControlValue({
  mode,
  modelId,
  options,
  models,
  allowedModes,
  optionDefinitions,
}: {
  mode: ToolMode | string;
  modelId: string;
  options: Record<string, unknown>;
  models: ToolModelDefinition[];
  allowedModes?: ToolMode[];
  optionDefinitions?: Record<string, ToolOptionDefinition>;
}) {
  const allowedModeSet = new Set(
    allowedModes ?? Array.from(SUPPORTED_CONTROL_MODES)
  );
  const filteredModels = models.filter((model) =>
    model.modeSupport.some((item) => allowedModeSet.has(item))
  );
  const availableModes = Array.from(
    new Set(
      filteredModels.flatMap((model) =>
        model.modeSupport.filter(
          (item) =>
            item !== 'chat' &&
            SUPPORTED_CONTROL_MODES.has(item) &&
            allowedModeSet.has(item)
        )
      )
    )
  ) as ToolMode[];

  const nextMode = availableModes.includes(mode as ToolMode)
    ? (mode as ToolMode)
    : (availableModes[0] ?? (mode as ToolMode));

  const availableModels = filteredModels.filter((model) =>
    model.modeSupport.includes(nextMode)
  );
  const selectedModel =
    availableModels.find((model) => model.id === modelId) ?? availableModels[0];

  const supportedOptionKeys = new Set(selectedModel?.supportedOptions ?? []);
  const nextOptions: Record<string, unknown> = {};

  for (const [key, value] of Object.entries({
    ...(selectedModel?.defaultOptions ?? {}),
    ...options,
  })) {
    if (!supportedOptionKeys.has(key)) {
      continue;
    }

    const option = optionDefinitions
      ? getMergedOptionDefinition(optionDefinitions, selectedModel, key)
      : undefined;
    nextOptions[key] = normalizeSelectOptionValue(option, value);
  }

  if (nextMode !== 'image-to-image' && nextMode !== 'image-to-video') {
    delete nextOptions.image_urls;
  }

  if (nextMode !== 'video-to-video') {
    delete nextOptions.video_urls;
  }

  return {
    mode: nextMode,
    modelId: selectedModel?.id ?? '',
    options: nextOptions,
  };
}

export function ToolControlBar({
  surface,
  value,
  onChange,
  className,
  allowedModes,
  onSurfaceChange,
}: {
  surface: ToolControlSurface;
  value: ToolControlValue;
  onChange: (nextValue: ToolControlValue) => void;
  className?: string;
  allowedModes?: ToolMode[];
  onSurfaceChange?: (surface: ToolControlSurface) => void;
}) {
  const { models, options: optionDefinitions } = useToolCatalog(surface);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const allowedModeSet = useMemo(
    () => new Set(allowedModes ?? Array.from(SUPPORTED_CONTROL_MODES)),
    [allowedModes]
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  const normalizedValue = value;

  const availableModes = Array.from(
    new Set(
      models.flatMap((model) =>
        model.modeSupport.filter(
          (item) =>
            item !== 'chat' &&
            SUPPORTED_CONTROL_MODES.has(item) &&
            allowedModeSet.has(item)
        )
      )
    )
  ) as ToolMode[];

  const availableModels = models.filter((model) =>
    model.modeSupport.includes(normalizedValue.mode as ToolMode)
  );
  const selectedModel =
    availableModels.find((model) => model.id === normalizedValue.modelId) ??
    availableModels[0];
  const modelFamilies = Array.from(
    new Map(
      availableModels.map((model) => {
        const family = getModelFamily(model);
        return [family.key, family];
      })
    ).values()
  );
  const [selectedFamilyKey, setSelectedFamilyKey] = useState(
    modelFamilies[0]?.key ?? ''
  );

  useEffect(() => {
    const activeFamilyKey = selectedModel
      ? getModelFamily(selectedModel).key
      : (modelFamilies[0]?.key ?? '');

    if (!activeFamilyKey) {
      return;
    }

    const familyStillVisible = modelFamilies.some(
      (family) => family.key === selectedFamilyKey
    );

    if (!familyStillVisible || selectedFamilyKey === '') {
      setSelectedFamilyKey(activeFamilyKey);
    }
  }, [modelFamilies, selectedFamilyKey, selectedModel]);

  const familyModels = availableModels.filter(
    (model) => getModelFamily(model).key === selectedFamilyKey
  );
  const primaryKeys = PRIMARY_OPTION_KEYS[surface].filter((key) =>
    selectedModel?.supportedOptions.includes(key)
  );
  const secondaryKeys = (selectedModel?.supportedOptions ?? []).filter(
    (key) =>
      !primaryKeys.includes(key) && key !== 'image_urls' && key !== 'video_urls'
  );
  const specsChips = buildSpecsChips({
    surface,
    model: selectedModel,
    options: normalizedValue.options,
    optionDefinitions,
  });

  return (
    <div className={cn('flex flex-wrap items-end gap-2.5', className)}>
      <SurfaceCommand
        interactive={hydrated}
        onSurfaceChange={onSurfaceChange}
        surface={surface}
      />

      <FeatureCommand
        interactive={hydrated}
        mode={normalizedValue.mode as ToolMode}
        modes={availableModes}
        onChange={(nextMode) =>
          onChange(
            normalizeToolControlValue({
              mode: nextMode,
              modelId: normalizedValue.modelId,
              options: normalizedValue.options,
              models,
              allowedModes,
              optionDefinitions,
            })
          )
        }
      />

      <button
        type="button"
        onClick={() => {
          if (!hydrated) {
            return;
          }

          setModelDialogOpen(true);
        }}
        className={cn(STUDIO_COMMAND_INTERACTIVE, 'text-[var(--studio-ink)]')}
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#11131a] text-[12px] font-semibold text-[var(--brand-signal)]">
          {selectedModel ? getModelMark(selectedModel) : '?'}
        </span>
        <span className="max-w-[180px] truncate text-[var(--studio-ink)]">
          {selectedModel?.label ?? 'Select model'}
        </span>
      </button>

      <Dialog
        open={hydrated ? modelDialogOpen : false}
        onOpenChange={setModelDialogOpen}
      >
        <DialogContent
          className={cn(
            'max-h-[calc(100vh-24px)] w-[calc(100vw-20px)] max-w-[calc(100vw-20px)] overflow-hidden rounded-[24px] p-0 sm:max-h-[720px] sm:w-[1088px] sm:max-w-[1088px]',
            STUDIO_DROPDOWN
          )}
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Select generation model</DialogTitle>
          <DialogDescription className="sr-only">
            Browse APIMart model families and pick the best model for the
            current workflow.
          </DialogDescription>
          <div className="grid min-h-0 grid-cols-1 sm:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border-b border-[color:var(--studio-line)] p-4 sm:border-r sm:border-b-0 sm:p-5">
              <div className="mb-4 px-2 text-[14px] font-medium tracking-tight text-[var(--studio-muted)]">
                Models
              </div>
              <div className="grid max-h-[520px] gap-2 overflow-y-auto pr-1 sm:grid-cols-1">
                {modelFamilies.map((family) => (
                  <button
                    key={family.key}
                    type="button"
                    onClick={() => setSelectedFamilyKey(family.key)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition',
                      family.key === selectedFamilyKey
                        ? 'border-white/10 bg-[var(--studio-panel-strong)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
                        : 'border-transparent bg-transparent text-[var(--studio-muted)] hover:border-white/8 hover:bg-white/[0.03] hover:text-[var(--studio-ink)]'
                    )}
                  >
                    <span
                      className={getFamilyGlyphClassName(
                        family.key,
                        family.key === selectedFamilyKey
                      )}
                    >
                      {getFamilyGlyph(family.key)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[17px] font-medium tracking-tight">
                        {family.label}
                      </div>
                      {family.badge ? (
                        <span
                          className={cn(
                            'mt-1.5 inline-flex rounded-[11px] border px-2.5 py-1 text-[11px] leading-none font-medium',
                            getFamilyBadgeClassName(family.badge)
                          )}
                        >
                          {family.badge}
                        </span>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 min-w-0 p-3 sm:p-4">
              <div className="flex h-full min-h-0 flex-col rounded-[22px] bg-[#15161d] p-3 sm:p-4">
                <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
                  {familyModels.map((model) => {
                    const isSelected = model.id === selectedModel?.id;
                    const credit =
                      model.creditCostByMode?.[
                        normalizedValue.mode as ToolMode
                      ];
                    const tags = getModelTags(model);

                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          onChange(
                            normalizeToolControlValue({
                              mode: normalizedValue.mode,
                              modelId: model.id,
                              options: normalizedValue.options,
                              models,
                              allowedModes,
                              optionDefinitions,
                            })
                          );
                          setModelDialogOpen(false);
                        }}
                        className={cn(
                          'flex w-full flex-col items-start rounded-[20px] border px-5 py-4 text-left transition',
                          isSelected
                            ? 'border-white/12 bg-[var(--studio-panel-strong)] text-[var(--studio-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                            : 'border-transparent bg-transparent text-[var(--studio-muted)] hover:border-white/8 hover:bg-white/[0.03] hover:text-[var(--studio-ink)]'
                        )}
                      >
                        <div className="flex w-full items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#0b0d12] text-[15px] font-semibold text-[var(--brand-signal)]">
                              {getModelMark(model)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="truncate text-[17px] font-medium tracking-tight text-[var(--studio-ink)]">
                                  {model.label}
                                </div>
                                {tags.map((tag) => (
                                  <span
                                    key={`${model.id}-${tag.label}`}
                                    className={cn(
                                      'rounded-[11px] border px-2.5 py-1 text-[11px] leading-none font-medium',
                                      getTagClassName(tag.tone)
                                    )}
                                  >
                                    {tag.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isSelected ? (
                            <Check className="mt-1 size-4 shrink-0 text-[var(--image-accent)]" />
                          ) : null}
                        </div>
                        {model.description ? (
                          <div className="mt-2 max-w-3xl text-[14px] leading-6 text-[var(--studio-muted)]">
                            {model.description}
                          </div>
                        ) : null}
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-[var(--studio-muted)]">
                          {model.ui?.outputLabel ? (
                            <span className="inline-flex items-center gap-2">
                              <Clock3 className="size-4" />
                              {model.ui.outputLabel}
                            </span>
                          ) : null}
                          {AI_CREDITS_ENABLED && credit ? (
                            <span className="inline-flex items-center gap-2 border-l border-[color:var(--studio-line)] pl-4">
                              <Sparkles className="size-4" />
                              {credit}+ credits
                            </span>
                          ) : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SpecsCommand
        interactive={hydrated}
        surface={surface}
        specChips={specsChips}
        normalizedValue={normalizedValue}
        optionDefinitions={optionDefinitions}
        selectedModel={selectedModel}
        primaryKeys={primaryKeys}
        onChange={onChange}
      />

      <AdvancedCommand
        interactive={hydrated}
        normalizedValue={normalizedValue}
        optionDefinitions={optionDefinitions}
        secondaryKeys={secondaryKeys}
        selectedModel={selectedModel}
        onChange={onChange}
      />
    </div>
  );
}

function SurfaceCommand({
  interactive = true,
  surface,
  onSurfaceChange,
}: {
  interactive?: boolean;
  surface: ToolControlSurface;
  onSurfaceChange?: (surface: ToolControlSurface) => void;
}) {
  const label = surface === 'image' ? 'AI Image' : 'AI Video';
  const Icon = surface === 'image' ? ImageIcon : Clapperboard;
  const activeClass =
    surface === 'image'
      ? 'text-[var(--image-accent)]'
      : 'text-[var(--video-accent)]';

  if (!onSurfaceChange) {
    return (
      <div
        className={cn(
          STUDIO_COMMAND_BASE,
          activeClass
        )}
      >
        <Icon className="size-3" />
        {label}
      </div>
    );
  }

  if (!interactive) {
    return (
      <button
        type="button"
        className={cn(
          STUDIO_COMMAND_BASE,
          activeClass
        )}
      >
        <Icon className="size-3.5" />
        {label}
        <ChevronDown className="size-3.5 text-[var(--studio-muted)]" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            STUDIO_COMMAND_INTERACTIVE,
            activeClass
          )}
        >
          <Icon className="size-3" />
          {label}
          <ChevronDown className="size-3 text-[var(--studio-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={cn('w-[240px]', STUDIO_DROPDOWN)}>
        <DropdownMenuRadioGroup
          value={surface}
          onValueChange={(nextValue) =>
            onSurfaceChange(nextValue as ToolControlSurface)
          }
        >
          <DropdownMenuRadioItem value="video">
            <Clapperboard className="size-4" />
            AI Video
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="image">
            <ImageIcon className="size-4" />
            AI Image
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FeatureCommand({
  interactive = true,
  mode,
  modes,
  onChange,
}: {
  interactive?: boolean;
  mode: ToolMode;
  modes: ToolMode[];
  onChange: (mode: ToolMode) => void;
}) {
  if (!interactive) {
    return (
      <button
        type="button"
        className={cn(STUDIO_COMMAND_BASE, 'text-[var(--studio-ink)]')}
      >
        <Sparkles className="size-3 text-[var(--brand-signal)]" />
        <span className="max-w-[220px] truncate">{getModeLabel(mode)}</span>
        <ChevronDown className="size-3 text-[var(--studio-muted)]" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(STUDIO_COMMAND_INTERACTIVE, 'text-[var(--studio-ink)]')}
        >
          <Sparkles className="size-3 text-[var(--brand-signal)]" />
          <span className="max-w-[220px] truncate">{getModeLabel(mode)}</span>
          <ChevronDown className="size-3 text-[var(--studio-muted)]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className={cn('w-[300px] rounded-[20px] p-3', STUDIO_DROPDOWN)}
      >
        <DropdownMenuLabel className="px-2 pb-3 text-[11px] tracking-[0.18em] text-[var(--studio-muted)] uppercase">
          Features
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => onChange(value as ToolMode)}
        >
          {modes.map((item) => (
            <DropdownMenuRadioItem
              key={item}
              value={item}
              className="rounded-[18px] border border-transparent px-4 py-4 text-[var(--studio-muted)] transition data-[highlighted]:bg-[var(--studio-panel-strong)] data-[highlighted]:text-[var(--studio-ink)] data-[state=checked]:border-white/10 data-[state=checked]:bg-[var(--studio-panel-strong)] data-[state=checked]:text-[var(--studio-ink)]"
            >
              <div className="space-y-1">
                <div className="text-[16px] font-medium">
                  {getModeLabel(item)}
                </div>
                <div className="text-xs leading-5 text-[var(--studio-muted)]">
                  {getModeDescription(item)}
                </div>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SpecsCommand({
  interactive = true,
  surface,
  specChips,
  normalizedValue,
  optionDefinitions,
  selectedModel,
  primaryKeys,
  onChange,
}: {
  interactive?: boolean;
  surface: ToolControlSurface;
  specChips: SpecChip[];
  normalizedValue: ToolControlValue;
  optionDefinitions: Record<string, ToolOptionDefinition>;
  selectedModel: ToolModelDefinition | undefined;
  primaryKeys: string[];
  onChange: (nextValue: ToolControlValue) => void;
}) {
  if (specChips.length === 0 || primaryKeys.length === 0) {
    return null;
  }

  if (!interactive) {
    return (
      <button
        type="button"
        className={cn(STUDIO_COMMAND_BASE, 'text-[var(--studio-ink)]')}
      >
        {specChips.map((chip, index) => {
          const Icon = chip.icon;

          return (
            <div key={chip.key} className="contents">
              {index > 0 ? (
                <span className="h-3.5 w-px bg-[color:var(--studio-line)]" />
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                {Icon ? (
                  <Icon className="size-3.5 text-[var(--studio-muted)]" />
                ) : null}
                {chip.label}
              </span>
            </div>
          );
        })}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(STUDIO_COMMAND_INTERACTIVE, 'text-[var(--studio-ink)]')}
        >
          {specChips.map((chip, index) => {
            const Icon = chip.icon;

            return (
              <div key={chip.key} className="contents">
                {index > 0 ? (
                  <span className="h-3.5 w-px bg-[color:var(--studio-line)]" />
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  {Icon ? (
                    <Icon className="size-3.5 text-[var(--studio-muted)]" />
                  ) : null}
                  {chip.label}
                </span>
              </div>
            );
          })}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          'w-[min(720px,calc(100vw-32px))] max-w-[calc(100vw-32px)] p-6',
          STUDIO_DROPDOWN
        )}
      >
        <div className="space-y-10">
          {primaryKeys.map((key) => {
            const option = getMergedOptionDefinition(
              optionDefinitions,
              selectedModel,
              key
            );
            if (!option) {
              return null;
            }

            return (
              <OptionGridSection
                key={option.key}
                label={
                  key === 'size'
                    ? surface === 'image'
                      ? 'Image Size'
                      : option.label
                    : key === 'duration'
                      ? 'Video Length'
                      : option.label
                }
                option={option}
                value={normalizedValue.options[option.key]}
                columns={
                  option.options && option.options.length <= 4
                    ? option.options.length
                    : 5
                }
                onChange={(value) =>
                  onChange({
                    ...normalizedValue,
                    options: {
                      ...normalizedValue.options,
                      [option.key]: value,
                    },
                  })
                }
              />
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdvancedCommand({
  interactive = true,
  normalizedValue,
  optionDefinitions,
  secondaryKeys,
  selectedModel,
  onChange,
}: {
  interactive?: boolean;
  normalizedValue: ToolControlValue;
  optionDefinitions: Record<string, ToolOptionDefinition>;
  secondaryKeys: string[];
  selectedModel: ToolModelDefinition | undefined;
  onChange: (nextValue: ToolControlValue) => void;
}) {
  if (secondaryKeys.length === 0) {
    return null;
  }

  if (!interactive) {
    return (
      <button
        type="button"
        className={STUDIO_ICON_COMMAND}
      >
        <MoreHorizontal className="size-4" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={STUDIO_ICON_COMMAND_INTERACTIVE}
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          'w-[min(440px,calc(100vw-32px))] max-w-[calc(100vw-32px)] p-5',
          STUDIO_DROPDOWN
        )}
      >
        <div className="space-y-6">
          {secondaryKeys.map((key) => {
            const option = getMergedOptionDefinition(
              optionDefinitions,
              selectedModel,
              key
            );
            if (!option) {
              return null;
            }

            if (option.type === 'select') {
              return (
                <OptionGridSection
                  key={option.key}
                  label={option.label}
                  option={option}
                  value={normalizedValue.options[option.key]}
                  columns={4}
                  onChange={(value) =>
                    onChange({
                      ...normalizedValue,
                      options: {
                        ...normalizedValue.options,
                        [option.key]: value,
                      },
                    })
                  }
                />
              );
            }

            if (option.type === 'boolean') {
              return (
                <div
                  key={option.key}
                  className="rounded-[20px] border border-[color:var(--studio-line)] bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium text-[var(--studio-ink)]">
                        {option.label}
                      </div>
                      {getOptionDescription(option) ? (
                        <div className="mt-2 text-sm leading-6 text-[var(--studio-muted)]">
                          {getOptionDescription(option)}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...normalizedValue,
                          options: {
                            ...normalizedValue.options,
                            [option.key]: !Boolean(
                              normalizedValue.options[option.key] ??
                                option.defaultValue
                            ),
                          },
                        })
                      }
                      className={cn(
                        'mt-1 inline-flex h-11 items-center rounded-[14px] px-4 text-sm font-medium transition',
                        Boolean(
                          normalizedValue.options[option.key] ??
                            option.defaultValue
                        )
                          ? 'bg-[var(--brand-signal)] text-white'
                          : 'bg-[var(--studio-hover-strong)] text-[var(--studio-muted)] hover:bg-[#3a3d49]'
                      )}
                    >
                      {Boolean(
                        normalizedValue.options[option.key] ??
                          option.defaultValue
                      )
                        ? 'Enabled'
                        : 'Disabled'}
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OptionGridSection({
  label,
  option,
  value,
  onChange,
  columns = 5,
}: {
  label: string;
  option?: ToolOptionDefinition;
  value: unknown;
  onChange: (value: string) => void;
  columns?: number;
}) {
  if (!option?.options?.length) {
    return null;
  }

  const selectedValue = String(value ?? option.defaultValue ?? '');

  return (
    <div className="space-y-4">
      <div className="text-[15px] font-medium text-[var(--studio-muted)]">
        {label}
      </div>
      <div className="rounded-[24px] bg-[var(--studio-panel)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div
          className={cn(
            'grid grid-cols-2 gap-2',
            columns === 2
              ? 'sm:grid-cols-2'
              : columns === 3
                ? 'sm:grid-cols-3'
                : columns === 4
                  ? 'sm:grid-cols-4'
                  : 'sm:grid-cols-5'
          )}
        >
          {option.options.map((choice) => {
            const active = selectedValue === choice.value;

            return (
              <button
                key={choice.value}
                type="button"
                onClick={() => onChange(choice.value)}
                className={cn(
                  'rounded-[16px] px-3 py-4 text-center text-[15px] font-medium transition',
                  active
                    ? 'bg-[var(--brand-signal)] text-white shadow-[0_10px_22px_rgba(229,106,17,0.16)]'
                    : 'text-[var(--studio-muted)] hover:bg-[var(--studio-hover-strong)] hover:text-[var(--studio-ink)]'
                )}
              >
                {choice.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
