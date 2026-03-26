import Image from 'next/image';

import { Link } from '@/core/i18n/navigation';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function BrandLogo({ brand }: { brand: BrandType }) {
  return (
    <Link
      href={brand.url || ''}
      target={brand.target || '_self'}
      className={`flex items-center gap-2 text-[color:inherit] ${brand.className || ''}`}
    >
      {brand.logo && (
        <Image
          src={brand.logo.src}
          alt={brand.title ? '' : brand.logo.alt || ''}
          width={brand.logo.width || 80}
          height={brand.logo.height || 80}
          className="h-7 w-auto rounded-md"
          unoptimized={brand.logo.src.startsWith('http')}
        />
      )}
      {brand.title && (
        <span className="text-base font-medium tracking-tight text-[color:inherit]">
          {brand.title}
        </span>
      )}
    </Link>
  );
}
