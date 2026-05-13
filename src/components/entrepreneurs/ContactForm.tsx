'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  entrepreneurFormSchema,
  type EntrepreneurFormData,
} from '@/lib/validation/entrepreneurForm';
import { revenueOptions } from '@/content/entrepreneurs';

interface ContactFormProps {
  successMessage: string;
}

export function ContactForm({ successMessage }: ContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntrepreneurFormData>({
    resolver: zodResolver(entrepreneurFormSchema),
  });

  const onSubmit = async (data: EntrepreneurFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/entrepreneur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error('[Entrepreneur form] Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
            onClick={() => setIsSubmitted(false)}
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
            placeholder="Anders Svensson"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Workshop Name */}
        <div>
          <label htmlFor="workshopName" className="mb-2 block text-sm font-medium text-gray-700">
            Workshop name <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('workshopName')}
            type="text"
            id="workshopName"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Svenssons Däckservice"
          />
          {errors.workshopName && (
            <p className="mt-1 text-sm text-red-600">{errors.workshopName.message}</p>
          )}
        </div>

        {/* City / Region */}
        <div>
          <label htmlFor="cityRegion" className="mb-2 block text-sm font-medium text-gray-700">
            City / region <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('cityRegion')}
            type="text"
            id="cityRegion"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Göteborg"
          />
          {errors.cityRegion && (
            <p className="mt-1 text-sm text-red-600">{errors.cityRegion.message}</p>
          )}
        </div>

        {/* Revenue */}
        <div>
          <label htmlFor="revenue" className="mb-2 block text-sm font-medium text-gray-700">
            Approximate annual revenue <span className="text-[#C8102E]">*</span>
          </label>
          <select
            {...register('revenue')}
            id="revenue"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
          >
            <option value="">Select revenue range</option>
            {revenueOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue.message}</p>}
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
            placeholder="anders@svensson-dack.se"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
            placeholder="+46 70 123 4567"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
            Anything you&apos;d like us to know (optional)
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={4}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder="Tell us more about your workshop or what you're looking for..."
          />
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
              I agree to the processing of my personal data in accordance with AutoCap&apos;s
              privacy policy. <span className="text-[#C8102E]">*</span>
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
