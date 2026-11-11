import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';

export interface NewsRow {
  slug: string;
  title: string;
  /** Short date, e.g. "Nov 2026". */
  date: string;
}

interface NewsOnDarkProps {
  eyebrow: string;
  title: string;
  rows: NewsRow[];
  /** Right-hand column, e.g. follow/media kit box. */
  aside?: ReactNode;
  allLabel: string;
}

/** Latest news as rows on black with a red arrow. */
export function NewsOnDark({ eyebrow, title, rows, aside, allLabel }: NewsOnDarkProps) {
  return (
    <section className="bg-ink text-white">
      <Container className="grid grid-cols-1 gap-12 py-12 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:py-16">
        <div className="flex flex-col">
          <Eyebrow className="mb-2">{eyebrow}</Eyebrow>
          <h2 className="t-h2-sm m-0 mb-5 text-white">{title}</h2>
          <ul className="m-0 list-none border-b border-rule-dark-2 p-0">
            {rows.map(row => (
              <li key={row.slug} className="border-t border-rule-dark-2">
                <Link
                  href={`/news/${row.slug}`}
                  className="group grid grid-cols-[1fr_24px] items-center gap-x-4 gap-y-1 py-[18px] text-white no-underline sm:grid-cols-[120px_1fr_24px]"
                >
                  <span className="t-meta col-span-2 text-text-3 sm:col-span-1">{row.date}</span>
                  <span className="font-medium group-hover:text-on-dark-2">{row.title}</span>
                  <span aria-hidden="true" className="text-red">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/news" className="mt-5 text-[15px] font-semibold text-white no-underline hover:text-on-dark-2">
            {allLabel} <span className="text-red">→</span>
          </Link>
        </div>
        {aside && <div className="flex flex-col gap-3.5 self-end">{aside}</div>}
      </Container>
    </section>
  );
}
