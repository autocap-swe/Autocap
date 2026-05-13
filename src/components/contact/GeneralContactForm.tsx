'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  generalContactFormSchema,
  type GeneralContactFormData,
} from '@/lib/validation/generalContactForm';
import type { ContactFormLabels } from '@/lib/cms/contact/types';

interface GeneralContactFormProps {
  successMessage: string;
  formLabels: ContactFormLabels;
}

export function GeneralContactForm({ successMessage, formLabels }: GeneralContactFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GeneralContactFormData>({
    resolver: zodResolver(generalContactFormSchema),
  });

  const onSubmit = async (data: GeneralContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error('[Contact] Submission failed:', err);
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
            Send another message
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
            {formLabels.nameLabel} <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder={formLabels.namePlaceholder}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            {formLabels.emailLabel} <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder={formLabels.emailPlaceholder}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
            {formLabels.subjectLabel} <span className="text-[#C8102E]">*</span>
          </label>
          <input
            {...register('subject')}
            type="text"
            id="subject"
            maxLength={200}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder={formLabels.subjectPlaceholder}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
            {formLabels.messageLabel} <span className="text-[#C8102E]">*</span>
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={5}
            maxLength={2000}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#C8102E] focus:outline-none focus:ring-1 focus:ring-[#C8102E]"
            placeholder={formLabels.messagePlaceholder}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
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
              {formLabels.gdprConsentText} <span className="text-[#C8102E]">*</span>
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
          {isSubmitting ? 'Sending...' : formLabels.submitButtonText}
        </button>
      </div>
    </form>
  );
}
