import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getArticlesContent, getArticleBySlugContent } from '@/lib/cms/article';
import { ArticleHeader } from '@/components/news/ArticleHeader';
import { ArticleBody } from '@/components/news/ArticleBody';
import { RelatedArticles } from '@/components/news/RelatedArticles';
import { ArticleActions } from '@/components/news/ArticleActions';
import { buildMetadata } from '@/lib/cms/seo';
import { cmsMediaUrl } from '@/lib/cms/media';

interface ArticleDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticlesContent().catch(() => []);
  return articles.map(article => ({ slug: article.slug }));
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

      {/* Article Body */}
      {article.fullContent && <ArticleBody content={article.fullContent} />}

      {/* Related Articles */}
      <RelatedArticles articles={article.relatedArticles ?? []} />
    </article>
  );
}
