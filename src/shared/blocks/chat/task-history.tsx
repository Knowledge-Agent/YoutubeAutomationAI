'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils';

type ChatTaskHistoryItem = {
  id: string;
  status: string;
  model: string;
  scene?: string | null;
  prompt: string | null;
  createdAt?: string | Date | null;
};

function formatModeLabel(value: string) {
  return value
    .split('-')
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function getStatusMeta(status: string) {
  switch (status) {
    case 'success':
      return {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'text-[var(--image-accent)]',
      };
    case 'failed':
      return {
        label: 'Failed',
        icon: AlertCircle,
        className: 'text-[var(--video-accent)]',
      };
    case 'canceled':
      return {
        label: 'Canceled',
        icon: XCircle,
        className: 'text-[var(--studio-muted)]',
      };
    case 'processing':
      return {
        label: 'Processing',
        icon: LoaderCircle,
        className: 'text-[var(--brand-signal)]',
      };
    case 'pending':
    default:
      return {
        label: 'Queued',
        icon: Clock3,
        className: 'text-[var(--brand-signal)]',
      };
  }
}

export function ChatTaskHistory({
  tasks,
  selectedTaskId,
  onSelect,
}: {
  tasks: ChatTaskHistoryItem[];
  selectedTaskId?: string;
  onSelect: (taskId: string) => void;
}) {
  if (!tasks.length) {
    return (
      <div className="flex h-full min-h-[280px] flex-col rounded-[24px] border border-[color:var(--studio-line)] bg-[#14151b] p-3">
        <div className="px-2 pb-2 text-[10px] font-medium tracking-[0.18em] text-[var(--studio-muted)] uppercase">
          Generation History
        </div>
        <div className="flex flex-1 items-center justify-center rounded-[18px] border border-dashed border-[color:var(--studio-line)] bg-white/[0.03] px-4 text-center text-sm text-[var(--studio-muted)]">
          No generation runs yet. Save or generate from the right panel to start the first task.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-[24px] border border-[color:var(--studio-line)] bg-[#14151b] p-3">
      <div className="px-2 pb-2 text-[10px] font-medium tracking-[0.18em] text-[var(--studio-muted)] uppercase">
        Generation History
      </div>
      <div className="min-h-0 space-y-2 overflow-y-auto pr-1">
        {tasks.map((task) => {
          const statusMeta = getStatusMeta(task.status);
          const StatusIcon = statusMeta.icon;

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onSelect(task.id)}
              className={cn(
                'w-full rounded-[18px] border px-3 py-3 text-left transition',
                task.id === selectedTaskId
                  ? 'border-white/14 bg-[var(--studio-panel-strong)] text-[var(--studio-ink)] shadow-[0_12px_24px_rgba(0,0,0,0.16)]'
                  : 'border-[color:var(--studio-line)] bg-white/[0.03] text-[var(--studio-muted)] hover:bg-white/[0.05] hover:text-[var(--studio-ink)]'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {task.prompt || 'Generation request'}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--studio-muted)]">
                    <span>{task.model}</span>
                    {task.scene ? <span>{formatModeLabel(task.scene)}</span> : null}
                    {task.createdAt ? (
                      <span>
                        {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(task.createdAt))}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 text-[11px] font-medium',
                    statusMeta.className
                  )}
                >
                  <StatusIcon
                    className={cn(
                      'size-3.5',
                      task.status === 'processing' && 'animate-spin'
                    )}
                  />
                  {statusMeta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
