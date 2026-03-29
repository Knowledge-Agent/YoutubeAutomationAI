export const AI_CREDITS_ENABLED =
  process.env.NEXT_PUBLIC_AI_CREDITS_ENABLED === 'true';

export function getAICreditCost(credits?: number | null) {
  if (!AI_CREDITS_ENABLED) {
    return 0;
  }

  return typeof credits === 'number' ? credits : 0;
}
