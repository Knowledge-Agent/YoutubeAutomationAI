import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import {
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { Section } from '@/shared/types/blocks/landing';

export function Blog({
  section,
  className,
  categories,
  currentCategory,
  posts,
}: {
  section: Section;
  className?: string;
  categories: CategoryType[];
  currentCategory: CategoryType;
  posts: PostType[];
}) {
  const t = useTranslations('pages.blog.messages');

  return (
    <section
      id={section.id}
      className={cn('py-14 md:py-20', section.className, className)}
    >
      <div className="mx-auto mb-6 max-w-4xl px-4 text-center md:mb-8">
        {section.sr_only_title && (
          <h1 className="sr-only">{section.sr_only_title}</h1>
        )}
        <h2 className="mb-3 text-3xl font-bold text-pretty lg:text-4xl">
          {section.title}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-sm leading-7 md:text-base lg:text-lg">
          {section.description}
        </p>
      </div>

      <div className="container flex flex-col items-center gap-6 lg:px-16">
        {categories && categories.length > 0 && (
          <nav
            aria-label="Blog categories"
            className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-2 py-3 md:gap-3"
          >
            {categories.map((category: CategoryType) => {
              const href =
                !category.slug || category.slug === 'all'
                  ? '/blog'
                  : `/blog/category/${category.slug}`;
              const isActive = currentCategory?.slug === category.slug;

              return (
                <Link
                  key={category.slug || category.id}
                  href={href}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors md:px-4',
                    'hover:border-foreground/30 hover:bg-foreground/5',
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-background text-muted-foreground'
                  )}
                >
                  {category.title}
                </Link>
              );
            })}
          </nav>
        )}

        {posts && posts.length > 0 ? (
          <div className="flex w-full flex-wrap items-start">
            {posts?.map((item, idx) => (
              <Link
                key={idx}
                href={item.url || ''}
                target={item.target || '_self'}
                className="w-full p-4 md:w-1/3"
              >
                <div className="border-border flex flex-col overflow-clip rounded-xl border">
                  {item.image && (
                    <div>
                      <img
                        src={item.image}
                        alt={item.title || ''}
                        className="aspect-16/9 h-full w-full object-cover object-center"
                      />
                    </div>
                  )}
                  <div className="px-4 py-4 md:px-4 md:py-4 lg:px-4 lg:py-4">
                    <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl lg:mb-6">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mb-3 md:mb-4 lg:mb-6">
                      {item.description}
                    </p>

                    <div className="text-muted-foreground flex items-center text-xs">
                      {item.created_at && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4" />
                          {item.created_at}
                        </div>
                      )}
                      <div className="flex-1"></div>
                      {(item.author_name || item.author_image) && (
                        <div className="flex items-center gap-2">
                          {item.author_image && (
                            <Avatar>
                              <AvatarImage
                                src={item.author_image || ''}
                                alt={item.author_name || ''}
                                className="size-6 rounded-full"
                              />
                              <AvatarFallback>
                                {item.author_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {item.author_name}
                        </div>
                      )}
                    </div>

                    {/* {blog.readMoreText && (
                      <p className="flex items-center hover:underline">
                        {blog.readMoreText}
                        <ArrowRight className="ml-2 size-4" />
                      </p>
                    )} */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-md py-8">
            {t('no_content')}
          </div>
        )}
      </div>
    </section>
  );
}
