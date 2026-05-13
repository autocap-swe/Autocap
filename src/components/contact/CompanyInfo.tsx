import type { CompanyContactInfo } from '@/lib/cms/contact/types';

export function CompanyInfo({ email, address, businessHours }: CompanyContactInfo) {
  return (
    <div className="rounded-lg bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-[#1C1C1E]">Contact Information</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <a href={`mailto:${email}`} className="text-lg text-[#C8102E] hover:underline">
            {email}
          </a>
        </div>

        {address && (
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-lg text-gray-700">{address}</p>
          </div>
        )}

        {businessHours && (
          <div>
            <p className="text-sm font-medium text-gray-500">Business Hours</p>
            <p className="text-lg text-gray-700">{businessHours}</p>
          </div>
        )}
      </div>
    </div>
  );
}
