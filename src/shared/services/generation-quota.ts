import { AIMediaType } from '@/extensions/ai';
import { getAITasksCountByDateRange } from '@/shared/models/ai_task';
import { hasRole, ROLES } from '@/shared/services/rbac';

const DAILY_LIMITS: Partial<Record<AIMediaType, number>> = {
  [AIMediaType.IMAGE]: 3,
  [AIMediaType.VIDEO]: 1,
};

export class GenerationQuotaExceededError extends Error {
  constructor(
    public mediaType: AIMediaType,
    public limit: number,
    public currentCount: number
  ) {
    super(`daily_quota_exceeded:${mediaType}:${currentCount}:${limit}`);
    this.name = 'GenerationQuotaExceededError';
  }
}

function getShanghaiDayRange() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((part) => part.type === 'year')?.value || '0');
  const month = Number(
    parts.find((part) => part.type === 'month')?.value || '1'
  );
  const day = Number(parts.find((part) => part.type === 'day')?.value || '1');

  const startUtc = new Date(Date.UTC(year, month - 1, day, -8, 0, 0));
  const endUtc = new Date(Date.UTC(year, month - 1, day + 1, -8, 0, 0));

  return {
    start: startUtc,
    end: endUtc,
  };
}

export async function assertGenerationQuota({
  userId,
  mediaType,
}: {
  userId: string;
  mediaType: AIMediaType;
}) {
  const limit = DAILY_LIMITS[mediaType];
  if (!limit) {
    return;
  }

  const isSuperAdmin = await hasRole(userId, ROLES.SUPER_ADMIN);
  if (isSuperAdmin) {
    return;
  }

  const { start, end } = getShanghaiDayRange();
  const currentCount = await getAITasksCountByDateRange({
    userId,
    mediaType,
    dateFrom: start,
    dateTo: end,
  });

  if (currentCount >= limit) {
    throw new GenerationQuotaExceededError(mediaType, limit, currentCount);
  }
}
