/** The 64×3 px red hairline under page titles. */
export function RedRule({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-[3px] w-16 bg-red ${className}`} />;
}
