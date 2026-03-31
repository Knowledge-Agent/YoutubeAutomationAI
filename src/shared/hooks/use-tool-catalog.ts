'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  ToolCatalogResponse,
  ToolModelDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

const catalogCache = new Map<ToolSurface, ToolCatalogResponse>();
const catalogInflight = new Map<ToolSurface, Promise<ToolCatalogResponse>>();

async function fetchToolCatalog(surface: ToolSurface) {
  const cached = catalogCache.get(surface);
  if (cached) {
    return cached;
  }

  const inflight = catalogInflight.get(surface);
  if (inflight) {
    return inflight;
  }

  const request = (async () => {
    const resp = await fetch(`/api/tools/models?surface=${surface}`);
    if (!resp.ok) {
      throw new Error(`request failed with status: ${resp.status}`);
    }

    const json = (await resp.json()) as {
      code: number;
      message?: string;
      data?: ToolCatalogResponse;
    };

    if (json.code !== 0 || !json.data) {
      throw new Error(json.message || 'failed to load catalog');
    }

    catalogCache.set(surface, json.data);
    return json.data;
  })();

  catalogInflight.set(surface, request);

  try {
    return await request;
  } finally {
    catalogInflight.delete(surface);
  }
}

export function useToolCatalog(
  surface: ToolSurface,
  initialCatalog?: ToolCatalogResponse | null
) {
  const cachedCatalog =
    catalogCache.get(surface) ??
    (initialCatalog?.surface === surface ? initialCatalog : null);
  const [catalog, setCatalog] = useState<ToolCatalogResponse | null>(
    cachedCatalog
  );
  const [loading, setLoading] = useState(!cachedCatalog);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCatalog?.surface === surface && initialCatalog.models.length > 0) {
      catalogCache.set(surface, initialCatalog);
      setCatalog(initialCatalog);
      setLoading(false);
      return;
    }

    const cached = catalogCache.get(surface);
    if (cached) {
      setCatalog(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);
        const nextCatalog = await fetchToolCatalog(surface);

        if (!cancelled) {
          setCatalog(nextCatalog);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'failed to load catalog');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCatalog();

    return () => {
      cancelled = true;
    };
  }, [initialCatalog, surface]);

  const models = useMemo<ToolModelDefinition[]>(
    () => catalog?.models ?? [],
    [catalog]
  );

  return {
    catalog,
    models,
    options: catalog?.options ?? {},
    loading,
    error,
  };
}
