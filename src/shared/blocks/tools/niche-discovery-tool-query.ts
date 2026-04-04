export interface NicheDiscoveryToolSearchState {
  seed?: string;
  format?: 'story' | 'shorts';
  assetType?: string;
  audience?: string;
  nicheSlug?: string;
  topicSlug?: string;
  hookSlug?: string;
}

export function readNicheDiscoveryToolSearchState(searchParams: {
  get: (key: string) => string | null;
}): NicheDiscoveryToolSearchState {
  return {
    seed: searchParams.get('seed') || undefined,
    format:
      (searchParams.get('format') as NicheDiscoveryToolSearchState['format']) ||
      undefined,
    assetType: searchParams.get('asset') || undefined,
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
