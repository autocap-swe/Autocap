import type { ReactNode } from 'react';
import { Container } from './Container';

export type SectionTone = 'white' | 'ink' | 'birch' | 'fjord';

const TONE_CLASS: Record<SectionTone, string> = {
  white: 'bg-white text-ink',
  ink: 'bg-ink text-white',
  birch: 'bg-birch text-ink',
  fjord: 'bg-fjord text-ink',
};

interface SectionProps {
  tone?: SectionTone;
  children: ReactNode;
  className?: string;
  /** Skip the inner container for full-bleed content. */
  bleed?: boolean;
  /** Draw a 1 px rule under the section (white sections only). */
  ruled?: boolean;
  id?: string;
  'aria-labelledby'?: string;
}

/** Vertical rhythm 72 px desktop / 48 px mobile. Tone sets background and text colour. */
export function Section({ tone = 'white', children, className = '', bleed, ruled, ...rest }: SectionProps) {
  const rule = ruled ? 'border-b border-rule' : '';
  return (
    <section className={`${TONE_CLASS[tone]} ${rule} py-12 lg:py-[72px] ${className}`} {...rest}>
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}
