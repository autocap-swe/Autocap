import type { ReactNode } from 'react';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';
import { RedRule } from './RedRule';

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  tone?: 'white' | 'ink';
  /** Extra content under the lead, e.g. figures on Investors. */
  children?: ReactNode;
}

/** Sub-page header without image: eyebrow, 64 px title, red rule, lead. */
export function PageHeader({ eyebrow, title, lead, tone = 'white', children }: PageHeaderProps) {
  const dark = tone === 'ink';
  return (
    <header className={dark ? 'bg-ink text-white' : 'border-b border-rule bg-white text-ink'}>
      <Container className="flex flex-col gap-[18px] pb-12 pt-14 lg:pt-[72px]">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="t-h1 m-0 max-w-[18ch]">{title}</h1>
        <RedRule />
        {lead && (
          <p className={`t-lead m-0 max-w-[640px] ${dark ? 'text-on-dark-2' : 'text-text-2'}`}>{lead}</p>
        )}
        {children}
      </Container>
    </header>
  );
}
