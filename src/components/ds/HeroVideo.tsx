import type { ReactNode } from 'react';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';
import { RedRule } from './RedRule';

interface HeroVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
}

/** Full-bleed video hero. Content sits bottom left; the header overlays the top. */
export function HeroVideo({ videoUrl, posterUrl, eyebrow, title, lead, children }: HeroVideoProps) {
  return (
    <section className="relative flex min-h-[640px] flex-col overflow-hidden bg-ink text-white lg:min-h-[760px]">
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterUrl}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-70 saturate-[0.6] contrast-[1.05]"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.35)_0%,rgba(17,17,17,0.1)_40%,rgba(17,17,17,0.75)_100%)]"
      />
      <Container className="relative flex flex-1 flex-col justify-end pb-12 pt-32 lg:pb-[72px]">
        <div className="flex max-w-[900px] flex-col gap-[22px]">
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
          <h1 className="t-hero m-0 text-white">{title}</h1>
          <RedRule />
          <p className="t-lead m-0 max-w-[620px] text-rule">{lead}</p>
          {children && <div className="mt-2 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
