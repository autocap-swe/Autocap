import { useTranslations } from 'next-intl';

/**
 * Fixed "About AutoCap Group" boilerplate, shown in small font at the bottom
 * of every press release. Text is hardcoded via i18n (en/sv) — same on every
 * press release.
 */
export function ArticleAbout() {
  const t = useTranslations('news');

  return (
    <section className="mx-auto max-w-3xl px-4 pb-6 sm:px-6">
      <div className="border-t border-gray-200 pt-6">
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#1C1C1E]">
          {t('aboutHeading')}
        </h2>
        <p className="text-[10px] leading-relaxed text-gray-500">{t('aboutBody')}</p>
      </div>
    </section>
  );
}
