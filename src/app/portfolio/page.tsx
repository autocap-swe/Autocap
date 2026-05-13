import Image from 'next/image';
import { MapPin, Building2 } from 'lucide-react';
import { WorkshopMap } from '@/components/portfolio/WorkshopMap';
import { WorkshopGrid } from '@/components/portfolio/WorkshopGrid';
import { getWorkshopsContent } from '@/lib/cms/workshop';

export const metadata = {
  title: 'Our Portfolio · AutoCap Group',
  description:
    "12 tire service workshops across Sweden. Explore AutoCap Group's growing portfolio.",
};

export default async function PortfolioPage() {
  const workshops = await getWorkshopsContent().catch(() => []);
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="/images/Portfolio.webp"
          alt="AutoCap portfolio workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          {/* Icon Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
            <Building2 className="h-5 w-5 text-[#C8102E]" />
            <span className="text-sm font-semibold text-[#C8102E]">12 Workshops</span>
          </div>

          <h1 className="mb-6 text-5xl font-black text-white md:text-6xl lg:text-7xl">
            Our Portfolio
          </h1>

          {/* Decorative Line */}
          <div className="mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="max-w-3xl text-xl leading-relaxed text-white md:text-2xl">
            AutoCap Group&apos;s portfolio spans 12 tire service centres across Sweden — from
            Stockholm&apos;s northern suburbs to Gothenburg&apos;s industrial zones. Every workshop
            keeps its local name, its team, and its customer relationships. What changes is what
            happens behind the scenes: shared procurement, centralised administration, and a network
            that makes each workshop stronger.
          </p>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Map Title */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4E2DE]">
              <MapPin className="h-6 w-6 text-[#C8102E]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1C1C1E]">Workshop Locations</h2>
          </div>

          <WorkshopMap workshops={workshops} />
        </div>
      </section>

      {/* Workshop Grid */}
      <WorkshopGrid workshops={workshops} />
    </>
  );
}
