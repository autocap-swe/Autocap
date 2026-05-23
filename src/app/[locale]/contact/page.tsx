import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact AutoCap Group · Get in Touch',
  description:
    'Contact AutoCap Group for investor relations, business inquiries, or general questions. We are here to help.',
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const contactInfo = [
    {
      icon: Mail,
      label: t('info.email.label'),
      value: 'info@autocapgroup.se',
      href: 'mailto:info@autocapgroup.se',
      type: 'email' as const,
    },
    {
      icon: Phone,
      label: t('info.phone.label'),
      value: '+46 (0)8 123 456 78',
      href: 'tel:+46812345678',
      type: 'phone' as const,
    },
    {
      icon: MapPin,
      label: t('info.address.label'),
      value: 'Storgatan 1, 114 51 Stockholm, Sweden',
      href: 'https://www.google.com/maps/search/?api=1&query=Storgatan+1,+114+51+Stockholm,+Sweden',
      type: 'location' as const,
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8]">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative flex min-h-[60vh] items-center justify-center px-6 py-24 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl">
              {t('hero.headline')}
            </h1>

            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('hero.subheadline')}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:text-4xl">
                {t('info.title')}
              </h2>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/10">
                        <item.icon className="h-6 w-6 text-[#C8102E]" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-600">
                          {item.label}
                        </h3>
                        {item.type === 'location' ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-medium text-[#1C1C1E] transition-colors hover:text-[#C8102E] hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <a
                            href={item.href}
                            className="text-lg font-medium text-[#1C1C1E] transition-colors hover:text-[#C8102E]"
                          >
                            {item.value}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-bold text-[#1C1C1E]">
                  {t('info.businessHours.title')}
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">{t('info.businessHours.weekdays')}:</span> 9:00
                    - 17:00
                  </p>
                  <p>
                    <span className="font-semibold">{t('info.businessHours.weekends')}:</span>{' '}
                    {t('info.businessHours.closed')}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:text-4xl">
                {t('form.title')}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
