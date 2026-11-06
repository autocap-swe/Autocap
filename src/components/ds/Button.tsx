import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';

export type ButtonVariant = 'primary' | 'outline' | 'outline-light' | 'light';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-red text-white hover:bg-[#a50d26] border border-red',
  outline: 'border border-ink text-ink hover:bg-ink hover:text-white',
  'outline-light': 'border border-white text-white hover:bg-white hover:text-ink',
  light: 'bg-white text-ink border border-white hover:bg-birch',
};

export function buttonClass(variant: ButtonVariant = 'primary'): string {
  return `inline-flex min-h-11 items-center justify-center rounded-[4px] px-6 py-3.5 text-[15px] font-semibold leading-none no-underline transition-colors ${VARIANT_CLASS[variant]}`;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** Internal link styled as a button. */
export function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
  return <Link className={`${buttonClass(variant)} ${className}`} {...props} />;
}
