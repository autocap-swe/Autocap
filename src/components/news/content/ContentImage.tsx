import Image from 'next/image';

interface ContentImageProps {
  src?: string;
  alt: string;
  caption?: string;
}

export function ContentImage({ src, alt, caption }: ContentImageProps) {
  if (!src) return null;
  return (
    <figure className="my-12">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-600">{caption}</figcaption>
      )}
    </figure>
  );
}
