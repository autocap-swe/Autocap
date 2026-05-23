import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { getNewsArticle, getNewsArticles } from '@/lib/strapi';
import { formatDate } from '@/lib/utils';
import RichText from '@/components/RichText';

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getNewsArticle(slug, locale);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} · AutoCap Group News`,
    description: article.excerpt || article.title,
  };
}

export async function generateStaticParams() {
  const articles = await getNewsArticles('en');
  return articles.map(article => ({
    slug: article.slug,
  }));
}

export default async function NewsArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');

  const article = await getNewsArticle(slug, locale);

  if (!article) {
    notFound();
  }

  const readingTime = Math.ceil(article.content.length / 1000);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8] py-12 md:py-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 md:px-8">
          <Link
            href={`/${locale}/news`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#C8102E] md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToNews')}
          </Link>

          <div className="mb-6">
            <span className="inline-block rounded-full bg-[#C8102E]/10 px-4 py-1.5 text-sm font-semibold text-[#C8102E]">
              {article.category}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-black leading-tight text-[#1C1C1E] md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 md:gap-6 md:text-base">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {readingTime} {t('minRead')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.featuredImage && (
        <section className="bg-white py-8 md:py-12">
          <div className="mx-auto max-w-5xl px-6 md:px-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-[#1C1C1E] prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#C8102E] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1C1C1E] prose-img:rounded-xl md:prose-xl">
            <RichText content={article.content} />
          </div>
        </div>
      </article>

      {/* Back to News CTA */}
      <section className="bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-6 py-3 text-base font-bold text-white transition-all duration-300 hover:scale-105 md:px-8 md:py-4 md:text-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            {t('backToNews')}
          </Link>
        </div>
      </section>
    </main>
  );
}
