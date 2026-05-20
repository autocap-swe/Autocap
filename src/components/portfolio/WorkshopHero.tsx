import Image from 'next/image';
import { MapPin, Building2 } from 'lucide-react';

interface WorkshopHeroProps {
  name: string;
  city: string;
  region: string;
  imageUrl: string | null;
  workshopProfileBadge: string;
}

export function WorkshopHero({
  name,
  city,
  region,
  imageUrl,
  workshopProfileBadge,
}: WorkshopHeroProps) {
  return (
    <div className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden">
      {imageUrl ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E]" />
      )}

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-12 pt-24 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
          <Building2 className="h-5 w-5 text-white" />
          <span className="text-sm font-semibold text-white">{workshopProfileBadge}</span>
        </div>

        <h1 className="mb-4 text-5xl font-black text-white md:text-6xl lg:text-7xl">{name}</h1>

        <div className="flex items-center gap-2 text-xl text-white/80">
          <MapPin className="h-5 w-5 text-[#C8102E]" />
          <span>
            {city}, {region}
          </span>
        </div>

        <div className="mt-6 h-1 w-24 bg-[#C8102E]" />
      </div>
    </div>
  );
}
