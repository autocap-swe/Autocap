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
    <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
      <div className="border-t border-gray-200 pt-6">
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#C8102E]">
          {t('contactHeading')}
        </h2>
        <div className="space-y-0.5 text-[10px] leading-relaxed text-gray-500">
          {name && <p className="font-semibold text-[#1C1C1E]">{name}</p>}
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
