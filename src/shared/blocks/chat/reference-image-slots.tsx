'use client';

import {
  ChangeEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ImagePlus, LoaderCircle, Search, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

type SlotStatus = 'empty' | 'uploading' | 'uploaded' | 'error';

type ReferenceImageSlot = {
  preview: string;
  url?: string;
  status: SlotStatus;
};

type CropDraft = {
  file: File;
  slotIndex: number;
  previewUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  offsetX: number;
  offsetY: number;
};

const SLOT_COUNT = 3;
const CROP_FRAME_SIZE = 440;
const SLOT_LABELS = ['Image1', 'Image2 (Opt)', 'Image3 (Opt)'] as const;

async function uploadImageFile(file: File) {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch('/api/storage/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  const result = await response.json();
  if (result.code !== 0 || !result.data?.urls?.length) {
    throw new Error(result.message || 'Upload failed');
  }

  return result.data.urls[0] as string;
}

function createEmptySlots(): ReferenceImageSlot[] {
  return Array.from({ length: SLOT_COUNT }, () => ({
    preview: '',
    status: 'empty' as SlotStatus,
  }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function syncSlotsFromUrls(urls: string[]) {
  const nextSlots = createEmptySlots();

  urls.slice(0, SLOT_COUNT).forEach((url, index) => {
    nextSlots[index] = {
      preview: url,
      url,
      status: 'uploaded',
    };
  });

  return nextSlots;
}

async function cropImageToBlob({
  imageUrl,
  naturalWidth,
  naturalHeight,
  offsetX,
  offsetY,
}: {
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  offsetX: number;
  offsetY: number;
}) {
  const coverScale = Math.max(
    CROP_FRAME_SIZE / naturalWidth,
    CROP_FRAME_SIZE / naturalHeight
  );
  const sourceX =
    naturalWidth / 2 - (CROP_FRAME_SIZE / 2 + offsetX) / coverScale;
  const sourceY =
    naturalHeight / 2 - (CROP_FRAME_SIZE / 2 + offsetY) / coverScale;
  const sourceSize = CROP_FRAME_SIZE / coverScale;
  const safeSourceX = clamp(sourceX, 0, Math.max(0, naturalWidth - sourceSize));
  const safeSourceY = clamp(
    sourceY,
    0,
    Math.max(0, naturalHeight - sourceSize)
  );

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available');
  }

  const image = new window.Image();
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = imageUrl;
  });

  context.drawImage(
    image,
    safeSourceX,
    safeSourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((value) => resolve(value), 'image/jpeg', 0.92);
  });

  if (!blob) {
    throw new Error('Failed to create cropped image');
  }

  return blob;
}

export function ChatReferenceImageSlots({
  value,
  onChange,
  maxSizeMB = 8,
  className,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  maxSizeMB?: number;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const slotsRef = useRef<ReferenceImageSlot[]>(syncSlotsFromUrls(value));
  const [slots, setSlots] = useState<ReferenceImageSlot[]>(() =>
    syncSlotsFromUrls(value)
  );
  const [pendingSlotIndex, setPendingSlotIndex] = useState<number | null>(null);
  const [cropDraft, setCropDraft] = useState<CropDraft | null>(null);

  useEffect(() => {
    const nextUrls = value.slice(0, SLOT_COUNT);
    const currentUrls = slotsRef.current
      .filter((item) => item.status === 'uploaded' && item.url)
      .map((item) => item.url as string);

    const isSame =
      currentUrls.length === nextUrls.length &&
      currentUrls.every((item, index) => item === nextUrls[index]);

    if (isSame) {
      return;
    }

    const nextSlots = syncSlotsFromUrls(nextUrls);
    slotsRef.current = nextSlots;
    setSlots(nextSlots);
  }, [value]);

  const emitUrls = (nextSlots: ReferenceImageSlot[]) => {
    slotsRef.current.forEach((slot, index) => {
      const nextSlot = nextSlots[index];
      if (
        slot.preview.startsWith('blob:') &&
        slot.preview !== nextSlot?.preview
      ) {
        URL.revokeObjectURL(slot.preview);
      }
    });
    slotsRef.current = nextSlots;
    setSlots(nextSlots);
    onChange(
      nextSlots
        .filter((item) => item.status === 'uploaded' && item.url)
        .map((item) => item.url as string)
    );
  };

  const openPicker = (slotIndex: number) => {
    setPendingSlotIndex(slotIndex);
    inputRef.current?.click();
  };

  const handleRemove = (slotIndex: number) => {
    const nextSlots = [...slotsRef.current];
    const currentSlot = nextSlots[slotIndex];

    if (currentSlot?.preview.startsWith('blob:')) {
      URL.revokeObjectURL(currentSlot.preview);
    }

    nextSlots[slotIndex] = {
      preview: '',
      status: 'empty',
    };

    emitUrls(nextSlots);
  };

  const handleSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';

    if (!selectedFile || pendingSlotIndex === null) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Only image files are supported');
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image exceeds the ${maxSizeMB}MB limit`);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    const probe = new window.Image();
    probe.onload = () => {
      const coverScale = Math.max(
        CROP_FRAME_SIZE / probe.naturalWidth,
        CROP_FRAME_SIZE / probe.naturalHeight
      );
      const maxOffsetX = Math.max(
        0,
        (probe.naturalWidth * coverScale - CROP_FRAME_SIZE) / 2
      );
      const maxOffsetY = Math.max(
        0,
        (probe.naturalHeight * coverScale - CROP_FRAME_SIZE) / 2
      );

      setCropDraft({
        file: selectedFile,
        slotIndex: pendingSlotIndex,
        previewUrl,
        naturalWidth: probe.naturalWidth,
        naturalHeight: probe.naturalHeight,
        offsetX: clamp(0, -maxOffsetX, maxOffsetX),
        offsetY: clamp(0, -maxOffsetY, maxOffsetY),
      });
    };
    probe.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      toast.error('Failed to read image');
    };
    probe.src = previewUrl;
  };

  const closeCropDraft = ({
    preservePreview = false,
  }: { preservePreview?: boolean } = {}) => {
    setPendingSlotIndex(null);
    setCropDraft((current) => {
      if (!preservePreview && current?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return null;
    });
  };

  const handleCropPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!cropDraft) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: cropDraft.offsetX,
      originY: cropDraft.offsetY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCropPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!cropDraft || !dragStateRef.current) {
      return;
    }

    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) {
      return;
    }

    const coverScale = Math.max(
      CROP_FRAME_SIZE / cropDraft.naturalWidth,
      CROP_FRAME_SIZE / cropDraft.naturalHeight
    );
    const maxOffsetX = Math.max(
      0,
      (cropDraft.naturalWidth * coverScale - CROP_FRAME_SIZE) / 2
    );
    const maxOffsetY = Math.max(
      0,
      (cropDraft.naturalHeight * coverScale - CROP_FRAME_SIZE) / 2
    );

    setCropDraft({
      ...cropDraft,
      offsetX: clamp(
        dragState.originX + (event.clientX - dragState.startX),
        -maxOffsetX,
        maxOffsetX
      ),
      offsetY: clamp(
        dragState.originY + (event.clientY - dragState.startY),
        -maxOffsetY,
        maxOffsetY
      ),
    });
  };

  const handleCropPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
    }
  };

  const handleConfirmCrop = () => {
    if (!cropDraft) {
      return;
    }

    const targetSlotIndex = cropDraft.slotIndex;
    const nextSlots = [...slotsRef.current];
    nextSlots[targetSlotIndex] = {
      preview: cropDraft.previewUrl,
      status: 'uploading',
      url: undefined,
    };
    emitUrls(nextSlots);

    void (async () => {
      try {
        const croppedBlob = await cropImageToBlob({
          imageUrl: cropDraft.previewUrl,
          naturalWidth: cropDraft.naturalWidth,
          naturalHeight: cropDraft.naturalHeight,
          offsetX: cropDraft.offsetX,
          offsetY: cropDraft.offsetY,
        });
        const croppedFile = new File([croppedBlob], cropDraft.file.name, {
          type: 'image/jpeg',
        });
        const uploadedUrl = await uploadImageFile(croppedFile);

        emitUrls(
          slotsRef.current.map((item, index) =>
            index === targetSlotIndex
              ? {
                  preview: uploadedUrl,
                  url: uploadedUrl,
                  status: 'uploaded',
                }
              : item
          )
        );
      } catch (error: any) {
        console.error('reference frame upload failed:', error);
        toast.error(error.message || 'Upload failed');
        emitUrls(
          slotsRef.current.map((item, index) =>
            index === targetSlotIndex
              ? {
                  preview: '',
                  status: 'error',
                  url: undefined,
                }
              : item
          )
        );
      }
    })();

    closeCropDraft({ preservePreview: true });
  };

  return (
    <>
      <div className={cn('flex shrink-0 items-start gap-2', className)}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelect}
        />
        {slots.map((slot, index) => {
          const isOptional = index > 0;
          const isFilled = slot.status === 'uploaded' && !!slot.url;

          return (
            <div
              key={SLOT_LABELS[index]}
              role="button"
              tabIndex={0}
              onClick={() => openPicker(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openPicker(index);
                }
              }}
              className={cn(
                'group flex h-[94px] w-[62px] shrink-0 flex-col items-center gap-1 rounded-[14px] p-1.5 text-center transition focus-visible:ring-2 focus-visible:ring-[var(--brand-signal)]/30 focus-visible:outline-none',
                isFilled
                  ? 'bg-transparent'
                  : 'border border-[color:var(--studio-line)] bg-white/[0.03] hover:bg-white/[0.05]'
              )}
            >
              <div
                className={cn(
                  'relative flex h-[56px] w-[42px] items-center justify-center overflow-hidden rounded-[10px] border text-[var(--studio-muted)] transition',
                  isFilled
                    ? 'border-[color:var(--studio-line)] bg-[#151821]'
                    : 'border-dashed border-[color:var(--studio-line)] bg-[var(--studio-panel-strong)]'
                )}
              >
                {slot.status === 'uploading' ? (
                  <LoaderCircle className="size-4 animate-spin text-white" />
                ) : isFilled ? (
                  <>
                    <img
                      src={slot.preview}
                      alt={SLOT_LABELS[index]}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 z-10 bg-black/18 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-signal)] text-white shadow-[0_10px_20px_rgba(229,106,17,0.24)]">
                        <Search className="size-3.5" />
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${SLOT_LABELS[index]}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(index);
                      }}
                      className="absolute top-0.5 right-0.5 z-30 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full bg-black/48 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70"
                    >
                      <X className="size-3" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[var(--studio-muted)]">
                    {index === 0 ? (
                      <Upload className="size-4" />
                    ) : (
                      <ImagePlus className="size-4" />
                    )}
                  </div>
                )}
              </div>
              <div className="flex h-8 flex-col items-center justify-start text-[11px] leading-3.5 text-[var(--studio-muted)]">
                <div>{isOptional ? `Image${index + 1}` : 'Image1'}</div>
                <div className={isOptional ? '' : 'invisible'}>(Opt)</div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!cropDraft}
        onOpenChange={(open) => !open && closeCropDraft()}
      >
        <DialogContent
          className="max-w-[560px] border-[color:var(--studio-line)] bg-[rgb(26_27_35_/_0.98)] p-0 text-[var(--studio-ink)] shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between border-b border-[color:var(--studio-line)] px-5 py-4">
            <DialogTitle className="text-[15px] font-semibold text-[var(--studio-ink)]">
              Edit uploaded images
            </DialogTitle>
            <button
              type="button"
              onClick={() => closeCropDraft()}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--studio-muted)] transition hover:bg-white/[0.08] hover:text-[var(--studio-ink)]"
            >
              <X className="size-4" />
            </button>
          </div>

          {cropDraft ? (
            <div className="px-5 pt-4">
              <div
                className="relative mx-auto h-[440px] w-[440px] overflow-hidden rounded-[4px] bg-black"
                onPointerDown={handleCropPointerDown}
                onPointerMove={handleCropPointerMove}
                onPointerUp={handleCropPointerUp}
                onPointerCancel={handleCropPointerUp}
              >
                <img
                  src={cropDraft.previewUrl}
                  alt="Crop preview"
                  draggable={false}
                  className="absolute top-1/2 left-1/2 max-w-none select-none"
                  style={{
                    width:
                      cropDraft.naturalWidth *
                      Math.max(
                        CROP_FRAME_SIZE / cropDraft.naturalWidth,
                        CROP_FRAME_SIZE / cropDraft.naturalHeight
                      ),
                    height:
                      cropDraft.naturalHeight *
                      Math.max(
                        CROP_FRAME_SIZE / cropDraft.naturalWidth,
                        CROP_FRAME_SIZE / cropDraft.naturalHeight
                      ),
                    transform: `translate(calc(-50% + ${cropDraft.offsetX}px), calc(-50% + ${cropDraft.offsetY}px))`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 border border-[#3b82f6] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.5)]" />
                <div className="pointer-events-none absolute top-0 left-0 h-2 w-2 rounded-full bg-[#3b82f6]" />
                <div className="pointer-events-none absolute top-0 right-0 h-2 w-2 rounded-full bg-[#3b82f6]" />
                <div className="pointer-events-none absolute right-0 bottom-0 h-2 w-2 rounded-full bg-[#3b82f6]" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 rounded-full bg-[#3b82f6]" />
              </div>
            </div>
          ) : null}

          <DialogFooter className="flex-row items-center justify-end gap-2 px-5 py-4">
            <button
              type="button"
              onClick={() => closeCropDraft()}
              className="inline-flex h-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] px-4 text-[14px] font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[#ff477e] px-4 text-[14px] font-semibold text-white transition hover:bg-[#ff5b8d]"
            >
              Ok
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
