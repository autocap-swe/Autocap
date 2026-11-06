import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

/** "Text →" link, 15 px/600. */
export function ArrowLink({ children, className = '', ...props }: ComponentProps<typeof Link>) {
  return (
    <Link className={`group inline-flex items-center gap-1.5 text-[15px] font-semibold no-underline ${className}`} {...props}>
      {children}
      <span aria-hidden="true" className="text-red transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
