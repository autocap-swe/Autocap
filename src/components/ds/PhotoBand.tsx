import Image from 'next/image';
import { Eyebrow } from './Eyebrow';

interface PhotoBandProps {
  imageUrl: string;
  eyebrow: string;
  title: string;
}

/** 420 px full-width photo band with text bottom left. */
export function PhotoBand({ imageUrl, eyebrow, title }: PhotoBandProps) {
  return (
    <section className="relative h-[360px] overflow-hidden bg-ink lg:h-[420px]">
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[center_35%] opacity-80 saturate-[0.65] contrast-[1.05]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0)_30%,rgba(17,17,17,0.7)_100%)]"
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-5 pb-10 text-white lg:px-16 lg:pb-12">
        <Eyebrow tone="light" className="mb-2">
          {eyebrow}
        </Eyebrow>
        <h2 className="t-h2-sm m-0 max-w-[640px] text-white">{title}</h2>
      </div>
    </section>
  );
}
