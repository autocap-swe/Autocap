import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NewsDetailContent } from '@/components/news/NewsDetailContent';
import { fetchNewsArticle } from '@/lib/strapi';

interface NewsDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  
  try {
    const article = await fetchNewsArticle(slug, locale);
    
    return {
      title: article.title,
      description: article.excerpt || article.title,
    };
  } catch (error) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let article;
  try {
    article = await fetchNewsArticle(slug, locale);
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-16 lg:py-20">
        <NewsDetailContent article={article} />
      </article>
    </main>
  );
}