'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  investorFormSchema,
  ENQUIRY_TYPES,
  type InvestorFormData,
} from '@/lib/validation/investorForm';

interface InvestorContactFormProps {
  successMessage: string;
}

export function InvestorContactForm({ successMessage }: InvestorContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
  });

  const onSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);

    const res = await fetch('/api/contact/investor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.name,
        organisation: data.organization,
        role: data.role,
        enquiryType: data.enquiryType,
        email: data.email,
        message: data.message,
        gdprConsent: data.gdprConsent,
      }),
    });

    setIsSubmitting(false);

    if (res.ok) {
      setIsSuccess(true);
      reset();
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-semibold text-[#1C1C1E]">Thank you</h3>
          <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-700">{successMessage}</p>
          <button
            onClick={() => setIsSuccess(false)}
            className="mt-6 text-[#C8102E] hover:underline"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-8 shadow-sm">
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
            Your name <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Your full name"
          />
          {errors.name && <p className="mt-2 text-sm text-[#C8102E]">{errors.name.message}</p>}
        </div>

        {/* Organization */}
        <div>
          <label htmlFor="organization" className="mb-2 block text-sm font-medium text-gray-700">
            Organization / Fund <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('organization')}
            type="text"
            id="organization"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Your organization or fund name"
          />
          {errors.organization && (
            <p className="mt-2 text-sm text-[#C8102E]">{errors.organization.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
            Role / Title <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('role')}
            type="text"
            id="role"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Your role or title"
          />
          {errors.role && <p className="mt-2 text-sm text-[#C8102E]">{errors.role.message}</p>}
        </div>

        {/* Enquiry Type */}
        <div>
          <label htmlFor="enquiryType" className="mb-2 block text-sm font-medium text-gray-700">
            Enquiry type <span className="text-[#C8102E]">*</span>
          </label>
          <select
            {...register('enquiryType')}
            id="enquiryType"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
          >
            <option value="">Select enquiry type</option>
            {ENQUIRY_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.enquiryType && (
            <p className="mt-2 text-sm text-[#C8102E]">{errors.enquiryType.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="mt-2 text-sm text-[#C8102E]">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
            Phone <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="+46 70 123 45 67"
          />
          {errors.phone && <p className="mt-2 text-sm text-[#C8102E]">{errors.phone.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
            Investment focus / interest <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={4}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Tell us about your investment focus or specific areas of interest..."
          />
          {errors.message && (
            <p className="mt-2 text-sm text-[#C8102E]">{errors.message.message}</p>
          )}
        </div>

        {/* GDPR Consent */}
        <div>
          <label className="flex items-start">
            <input
              {...register('gdprConsent')}
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
            />
            <span className="ml-3 text-sm text-gray-700">
              I consent to AutoCap Group processing my personal data for the purpose of investor
              relations. All enquiries are treated confidentially.{' '}
              <span className="text-[#C8102E]">*</span>
            </span>
          </label>
          {errors.gdprConsent && (
            <p className="mt-1 text-sm text-red-600">{errors.gdprConsent.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#C8102E] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#A00D25] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
        </button>
      </div>
    </form>
  );
}
