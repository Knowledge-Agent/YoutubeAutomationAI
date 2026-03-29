'use client';

import { useEffect, useMemo, useState } from 'react';

import type {
  ToolCatalogResponse,
  ToolModelDefinition,
  ToolSurface,
} from '@/shared/types/ai-tools';

export function useToolCatalog(
  surface: ToolSurface,
  initialCatalog?: ToolCatalogResponse | null
) {
  const [catalog, setCatalog] = useState<ToolCatalogResponse | null>(
    initialCatalog ?? null
  );
  const [loading, setLoading] = useState(!initialCatalog);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      initialCatalog &&
      initialCatalog.surface === surface &&
      initialCatalog.models.length > 0
    ) {
      return;
    }

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
