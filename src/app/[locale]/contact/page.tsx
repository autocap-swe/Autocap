import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import { MapPin, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact AutoCap Group · Get in Touch',
  description:
    'Contact AutoCap Group for inquiries about our tire service centres, investment opportunities, or general questions.',
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const contactInfo = [
    {
      icon: MapPin,
      label: t('info.address.label'),
      value: t('info.address.value'),
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t('info.address.value'))}`,
      isExternal: true,
    },
    {
      icon: Mail,
      label: t('info.email.label'),
      value: t('info.email.value'),
      href: `mailto:${t('info.email.value')}`,
      isExternal: false,
    },
    {
      icon: Phone,
      label: t('info.phone.label'),
      value: t('info.phone.value'),
      href: `tel:${t('info.phone.value')}`,
      isExternal: false,
    },
  ];

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8]">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative flex min-h-[70vh] items-center justify-center px-6 py-24 md:px-8">
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
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:text-4xl">
                {t('form.title')}
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-gray-700">
                {t('form.description')}
              </p>
              <ContactForm />
            </div>

            <div>
              <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:text-4xl">
                {t('info.title')}
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/10">
                        <item.icon className="h-6 w-6 text-[#C8102E]" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-600">
                          {item.label}
                        </h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.isExternal ? '_blank' : undefined}
                            rel={item.isExternal ? 'noopener noreferrer' : undefined}
                            className="text-lg font-medium text-[#1C1C1E] transition-colors hover:text-[#C8102E] hover:underline"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-lg font-medium text-[#1C1C1E]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-xl font-bold text-[#1C1C1E]">{t('info.hours.title')}</h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">{t('info.hours.weekdays.label')}:</span>{' '}
                    {t('info.hours.weekdays.value')}
                  </p>
                  <p>
                    <span className="font-semibold">{t('info.hours.weekend.label')}:</span>{' '}
                    {t('info.hours.weekend.value')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
