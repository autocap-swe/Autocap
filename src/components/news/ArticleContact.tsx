import { useTranslations } from 'next-intl';

interface ArticleContactProps {
  name?: string;
  email?: string;
  phone?: string;
  /** Used when no per-article email is set (e.g. default press contact). */
  fallbackEmail?: string;
}

/**
 * Press/media contact block, shown at the bottom of a press release.
 * Per-article (filled in the CMS); falls back to a default email when none set.
 */
export function ArticleContact({ name, email, phone, fallbackEmail }: ArticleContactProps) {
  const t = useTranslations('news');
  const effectiveEmail = email ?? fallbackEmail;

  return (
    <section className="mx-auto max-w-3xl px-4 pt-6 pb-12 sm:px-6">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#C8102E]">
          {t('contactHeading')}
        </h2>
        <div className="space-y-1 text-base text-[#1C1C1E]">
          {name && <p className="font-semibold">{name}</p>}
          {effectiveEmail && (
            <p>
              <a href={`mailto:${effectiveEmail}`} className="text-[#C8102E] hover:underline">
                {effectiveEmail}
              </a>
            </p>
          )}
          {phone && (
            <p>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:underline">
                {phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
