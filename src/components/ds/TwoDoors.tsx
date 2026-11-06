import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { Eyebrow } from './Eyebrow';

export interface Door {
  eyebrow: string;
  title: string;
  text: string;
  linkLabel: string;
  href: ComponentProps<typeof Link>['href'];
}

/** Two text doors side by side with a rule between, stacked on mobile. */
export function TwoDoors({ doors }: { doors: [Door, Door] }) {
  return (
    <section className="border-b border-rule bg-white text-ink">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 md:grid-cols-2">
        {doors.map((door, index) => (
          <Link
            key={door.title}
            href={door.href}
            className={`group flex flex-col gap-3.5 px-5 py-12 no-underline lg:px-16 lg:py-14 ${
              index === 0 ? 'border-b border-rule md:border-b-0 md:border-r' : ''
            }`}
          >
            <Eyebrow>{door.eyebrow}</Eyebrow>
            <h2 className="t-h2-sm m-0 max-w-[20ch]">{door.title}</h2>
            <p className="t-body m-0 max-w-[520px] text-text-2">{door.text}</p>
            <span className="mt-1.5 text-[15px] font-semibold group-hover:text-red">
              {door.linkLabel} <span className="text-red">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
