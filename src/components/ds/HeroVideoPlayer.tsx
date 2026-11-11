'use client';

import { useEffect, useState } from 'react';

/** Wide screens only, and never against the visitor's reduced-motion or data-saver setting. */
export function shouldPlayVideo(): boolean {
  if (typeof window === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    window.matchMedia('(min-width: 768px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !connection?.saveData
  );
}

/**
 * Background video that is fetched after the page has rendered. Phones keep the still image:
 * the video is the heaviest file on the site and adds nothing on a small screen.
 */
export function HeroVideoPlayer({ src, className }: { src: string; className: string }) {
  const [play, setPlay] = useState(false);
  useEffect(() => setPlay(shouldPlayVideo()), []);
  if (!play) return null;
  return (
    <video autoPlay loop muted playsInline aria-hidden="true" className={className}>
      <source src={src} type="video/mp4" />
    </video>
  );
}
