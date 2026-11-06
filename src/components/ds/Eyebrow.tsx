import type { ReactNode } from 'react';

/** Red uppercase label above headings. `tone="light"` for use on photos. */
export function Eyebrow({
  children,
  tone = 'red',
  className = '',
}: {
  children: ReactNode;
  tone?: 'red' | 'light';
  className?: string;
}) {
  const color = tone === 'light' ? 'text-white' : 'text-red';
  return <p className={`t-eyebrow m-0 ${color} ${className}`}>{children}</p>;
}
