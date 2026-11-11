'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Eyebrow } from './Eyebrow';

export interface CompanyView {
  key: string;
  name: string;
  /** Meta line in the list, e.g. "7 workshops · Stockholm · East". */
  listMeta: string;
  regionLabel: string;
  description: string;
  facts: { label: string; value: string }[];
  /** Site names when the company has more than one workshop. */
  sites: string[];
  website?: { href: string; label: string };
  imageUrl?: string;
}

/** Company list on the left, selected company on black to the right. Stacked on mobile. */
export function CompanyPanel({ companies, sitesLabel }: { companies: CompanyView[]; sitesLabel: string }) {
  const [selectedKey, setSelectedKey] = useState(companies[0]?.key);

  // Logo wall tiles link to #company-<key>; follow the hash.
  useEffect(() => {
    const select = () => {
      const key = window.location.hash.replace('#company-', '');
      if (companies.some(company => company.key === key)) setSelectedKey(key);
    };
    select();
    window.addEventListener('hashchange', select);
    return () => window.removeEventListener('hashchange', select);
  }, [companies]);

  const selected = companies.find(company => company.key === selectedKey) ?? companies[0];
  if (!selected) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
      <ul className="m-0 flex list-none flex-col border-rule p-0 px-5 py-6 lg:border-r lg:py-10 lg:pl-16 lg:pr-12">
        {companies.map(company => {
          const active = company.key === selected.key;
          return (
            <li key={company.key} id={`company-${company.key}`} className="scroll-mt-28 border-b border-rule last:border-b-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedKey(company.key)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-4 py-4 text-left"
              >
                <span>
                  <span className={`block text-lg ${active ? 'font-semibold text-ink' : 'text-text-2'}`}>
                    {company.name}
                  </span>
                  <span className={`t-meta block ${active ? 'text-red' : 'text-text-3'}`}>{company.listMeta}</span>
                </span>
                <span aria-hidden="true" className={active ? 'text-red' : 'text-text-3'}>
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <article aria-live="polite" className="grid grid-cols-1 bg-ink text-white md:grid-cols-2">
        <div className="flex flex-col gap-3.5 px-5 py-10 lg:p-12">
          <Eyebrow>{selected.regionLabel}</Eyebrow>
          <h2 className="t-h2-sm m-0 text-white">{selected.name}</h2>
          <p className="m-0 text-[15px] leading-[1.55] text-on-dark-2">{selected.description}</p>
          <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-rule-dark-2 pt-4 text-sm">
            {selected.facts.map(fact => (
              <div key={fact.label} className="contents">
                <dt className="text-text-3">{fact.label}</dt>
                <dd className="m-0">{fact.value}</dd>
              </div>
            ))}
            {selected.sites.length > 1 && (
              <div className="contents">
                <dt className="text-text-3">{sitesLabel}</dt>
                <dd className="m-0">{selected.sites.join(' · ')}</dd>
              </div>
            )}
          </dl>
          {selected.website && (
            <a
              href={selected.website.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm font-semibold text-white no-underline hover:text-on-dark-2"
            >
              {selected.website.label} <span className="text-red">→</span>
            </a>
          )}
        </div>
        <div className="relative min-h-[260px] bg-ink-2 md:min-h-[420px]">
          {selected.imageUrl && (
            <Image
              key={selected.key}
              src={selected.imageUrl}
              alt={selected.name}
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover saturate-[0.6]"
            />
          )}
        </div>
      </article>
    </div>
  );
}
