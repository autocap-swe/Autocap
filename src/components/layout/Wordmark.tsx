/** Text wordmark "AutoCap Group" (600 + 300). Inherits colour; size via className. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-[-0.01em] ${className}`}>
      AutoCap <span className="font-light">Group</span>
    </span>
  );
}
