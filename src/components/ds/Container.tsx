import type { ReactNode } from 'react';

/** Page width 1440, side margin 64 px desktop / 20 px mobile. */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-5 lg:px-16 ${className}`}>{children}</div>;
}
