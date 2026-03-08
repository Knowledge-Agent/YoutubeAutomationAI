import { getThemeBlock } from '@/core/theme';
import type { DynamicPage as DynamicPageType } from '@/shared/types/blocks/landing';

export default async function DynamicPage({
  locale,
  page,
  data,
}: {
  locale?: string;
  page: DynamicPageType;
  data?: Record<string, any>;
}) {
  const sectionKeys = page.show_sections || Object.keys(page.sections || {});
  const hasHeroSection = sectionKeys.some((sectionKey) => {
    const section = page.sections?.[sectionKey];
    if (!section) {
      return false;
    }

    const blockName = String(section.block || '').toLowerCase();
    const sectionId = String(section.id || '').toLowerCase();
    return blockName.startsWith('hero') || sectionId === 'hero';
  });

  return (
    <>
      {page.title && !hasHeroSection && (
        <h1 className="sr-only">{page.title}</h1>
      )}
      {page?.sections &&
        Object.keys(page.sections).map(async (sectionKey: string) => {
          const section = page.sections?.[sectionKey];
          if (!section || section.disabled === true) {
            return null;
          }

          if (page.show_sections && !page.show_sections.includes(sectionKey)) {
            return null;
          }

          // block name
          const block = section.block || section.id || sectionKey;

          switch (block) {
            default:
              try {
                if (section.component) {
                  return section.component;
                }

                const DynamicBlock = await getThemeBlock(block);
                return (
                  <DynamicBlock
                    key={sectionKey}
                    section={section}
                    {...(data || section.data || {})}
                  />
                );
              } catch (error) {
                return null;
              }
          }
        })}
    </>
  );
}
