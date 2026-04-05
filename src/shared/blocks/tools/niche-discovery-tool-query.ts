export interface NicheDiscoveryToolSearchState {
  seed?: string;
  format?: 'story' | 'shorts';
  assetType?: string;
  audience?: string;
  nicheSlug?: string;
  topicSlug?: string;
  hookSlug?: string;
}

const DEFAULT_FORMAT: NicheDiscoveryToolSearchState['format'] = 'story';
const DEFAULT_ASSET_TYPE = 'stock footage';

function normalizeFormat(
  value: string | null
): NicheDiscoveryToolSearchState['format'] | undefined {
  if (!value) {
    return undefined;
  }

  return value === 'shorts' || value === 'story' ? value : DEFAULT_FORMAT;
}

function normalizeAssetType(value: string | null) {
  if (!value) {
    return undefined;
  }

  return value === 'screenshots' || value === 'stock footage'
    ? value
    : DEFAULT_ASSET_TYPE;
}

export function readNicheDiscoveryToolSearchState(searchParams: {
  get: (key: string) => string | null;
}): NicheDiscoveryToolSearchState {
  return {
    seed: searchParams.get('seed') || undefined,
    format: normalizeFormat(searchParams.get('format')),
    assetType: normalizeAssetType(searchParams.get('asset')),
    audience: searchParams.get('audience') || undefined,
    nicheSlug: searchParams.get('niche') || undefined,
    topicSlug: searchParams.get('topic') || undefined,
    hookSlug: searchParams.get('hook') || undefined,
  };
}

export function buildNicheDiscoveryToolSearchParams(
  currentParams: URLSearchParams,
  state: NicheDiscoveryToolSearchState
) {
  const nextParams = new URLSearchParams(currentParams.toString());
  const entries: Array<[keyof NicheDiscoveryToolSearchState, string]> = [
    ['seed', 'seed'],
    ['format', 'format'],
    ['assetType', 'asset'],
    ['audience', 'audience'],
    ['nicheSlug', 'niche'],
    ['topicSlug', 'topic'],
    ['hookSlug', 'hook'],
  ];

  for (const [stateKey, queryKey] of entries) {
    const value = state[stateKey]?.trim();

    if (value) {
      nextParams.set(queryKey, value);
    } else {
      nextParams.delete(queryKey);
    }
  }

  return nextParams;
}
