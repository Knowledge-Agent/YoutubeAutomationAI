'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  ToolCatalogResponse,
  ToolModelDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

export function useToolCatalog(surface: ToolSurface) {
  const [catalog, setCatalog] = useState<ToolCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCatalog = async () => {
      try {
        setLoading(true);
        setError(null);

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

        if (!cancelled) {
          setCatalog(json.data);
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
  }, [surface]);

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
