import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getArticlesContent, getArticleBySlugContent } from '@/lib/cms/article';
import { ArticleHeader } from '@/components/news/ArticleHeader';
import { ArticleIngress } from '@/components/news/ArticleIngress';
import { ArticleBody } from '@/components/news/ArticleBody';
import { ArticleContact } from '@/components/news/ArticleContact';
import { ArticleAbout } from '@/components/news/ArticleAbout';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { ArticleActions } from '@/components/news/ArticleActions';
import { ArticleLocalizedPathSetter } from '@/components/news/ArticleLocalizedPathSetter';
import { buildMetadata } from '@/lib/cms/seo';
import { COMPANY_INFO } from '@/lib/constants';

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams({ params }: { params: { locale?: string } }) {
  const articles = await getArticlesContent(undefined, params.locale).catch(() => []);
  return articles
    .filter(a => typeof a.slug === 'string' && a.slug.length > 0)
    .map(a => ({ slug: a.slug as string }));
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlugContent(slug, undefined, locale);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const meta = buildMetadata(
    { title: `${article.title} · AutoCap Group`, description: article.excerpt },
    article.seo,
    locale
  );
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: article.publishDate,
      images: meta.openGraph?.images ?? (article.imageUrl ? [{ url: article.imageUrl }] : []),
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [article, t] = await Promise.all([
    getArticleBySlugContent(slug, undefined, locale),
    getTranslations('news'),
  ]);

  if (!article) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AutoCap Group',
      logo: {
        '@type': 'ImageObject',
        url: 'https://autocapgroup.se/logo.png',
      },
    },
  };

  return (
    <article className="bg-white">
      {article.localizedSlugs && (
        <ArticleLocalizedPathSetter localizedSlugs={article.localizedSlugs} basePath="/news" />
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-4 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                {t('breadcrumbHome')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/news" className="text-gray-500 hover:text-gray-700">
                {t('breadcrumbNews')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">{article.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article Header */}
      <ArticleHeader article={article} />

      {/* Article Actions */}
      <div className="mx-auto max-w-4xl px-4">
        <ArticleActions />
      </div>

      {/* Ingress (lead paragraph) — leads directly into the body */}
      {article.ingress && <ArticleIngress ingress={article.ingress} />}

      {/* Article Body */}
      {article.fullContent && <ArticleBody content={article.fullContent} />}

      {/* About AutoCap Group boilerplate — press releases only */}
      {article.category === 'Press Release' && <ArticleAbout />}

      {/* Press contact — below the About text; fallback on press releases, opt-in elsewhere */}
      {(article.category === 'Press Release' ||
        article.pressContactName ||
        article.pressContactEmail ||
        article.pressContactPhone) && (
        <ArticleContact
          name={article.pressContactName}
          email={article.pressContactEmail}
          phone={article.pressContactPhone}
          fallbackEmail={article.category === 'Press Release' ? COMPANY_INFO.email : undefined}
        />
      )}

      {/* Related Articles */}
      <RelatedArticles articles={article.relatedArticles ?? []} />
    </article>
  );
}
