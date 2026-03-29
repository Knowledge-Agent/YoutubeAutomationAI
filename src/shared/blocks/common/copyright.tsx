'use client';

import { useEffect, useState } from 'react';

import { envConfigs } from '@/config';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function Copyright({ brand }: { brand: BrandType }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="text-sm text-[color:inherit] opacity-70">
      © {currentYear || 2024}{' '}
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="cursor-pointer text-[color:inherit] opacity-100 transition hover:text-[var(--brand-signal)]"
      >
        {brand?.title || envConfigs.app_name}
      </a>
      , All rights reserved
    </div>
  );
}
