import Image from 'next/image';

/** The AutoCap Group logotype. `tone` picks the file for the background; height via className. */
export function Wordmark({ tone = 'dark', className = '' }: { tone?: 'dark' | 'white'; className?: string }) {
  return (
    <Image
      src={tone === 'white' ? '/logos/autocap-white.png' : '/logos/autocap-dark.png'}
      alt="AutoCap Group"
      width={1970}
      height={480}
      priority
      className={`w-auto ${className}`}
    />
  );
}
