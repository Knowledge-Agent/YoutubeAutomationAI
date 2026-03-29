function parseEnvFlag(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
    return true;
  }

  if (normalized === 'false' || normalized === '0' || normalized === 'no') {
    return false;
  }

  return fallback;
}

// Credits are enabled by default because the current AI generation APIs enforce
// credit checks on the backend. This flag only controls client-side UX.
export const AI_CREDITS_ENABLED = parseEnvFlag(
  process.env.NEXT_PUBLIC_AI_CREDITS_ENABLED,
  true
);
