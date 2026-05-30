'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle2 } from 'lucide-react';
import { EntrepreneurSchema, type EntrepreneurFormData } from '@/lib/contact/schema';
import { TurnstileWidget } from '@/components/contact/TurnstileWidget';
import type { EntrepreneursFormLabels } from '@/lib/cms/entrepreneurs-page/types';
import { trackFormSubmit } from '@/lib/analytics';

interface ContactFormProps {
  successMessage: string;
  formLabels: EntrepreneursFormLabels;
}

export function ContactForm({ successMessage, formLabels }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitSuccess && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitSuccess]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EntrepreneurFormData>({
    resolver: zodResolver(EntrepreneurSchema),
  });

  const onSubmit = async (data: EntrepreneurFormData) => {
    if (!turnstileToken) {
      setSubmitError('Please complete the security check');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/contact/entrepreneur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, cfTurnstileToken: turnstileToken }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        trackFormSubmit('entrepreneur');
        reset();
        setTurnstileToken(null);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Failed to submit form');
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div ref={successRef} className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-4 inline-flex items-center justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-[#1C1C1E]">{successMessage}</h3>
        <p className="text-gray-600">We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-6">
        <label htmlFor="name" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formNameLabel} *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formEmailLabel} *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formPhoneLabel} *
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="workshopName" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formWorkshopNameLabel} *
        </label>
        <input
          id="workshopName"
          type="text"
          {...register('workshopName')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.workshopName && (
          <p className="mt-1 text-sm text-red-600">{errors.workshopName.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="cityRegion" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formCityRegionLabel} *
        </label>
        <input
          id="cityRegion"
          type="text"
          {...register('cityRegion')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.cityRegion && (
          <p className="mt-1 text-sm text-red-600">{errors.cityRegion.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="revenue" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formRevenueLabel} *
        </label>
        <select
          id="revenue"
          {...register('revenue')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        >
          <option value="">Select range</option>
          <option value="€0 - €500k">€0 - €500k</option>
          <option value="€500k - €1M">€500k - €1M</option>
          <option value="€1M - €3M">€1M - €3M</option>
          <option value="€3M+">€3M+</option>
        </select>
        {errors.revenue && <p className="mt-1 text-sm text-red-600">{errors.revenue.message}</p>}
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="mb-2 block font-semibold text-[#1C1C1E]">
          {formLabels.formMessageLabel}
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <div className="mb-6">
        <label className="flex items-start">
          <input
            {...register('gdprConsent')}
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#C8102E] focus:ring-[#C8102E]"
          />
          <span className="ml-3 text-sm text-gray-700">
            {formLabels.formGdprConsentText} <span className="text-[#C8102E]">*</span>
          </span>
        </label>
        {errors.gdprConsent && (
          <p className="mt-1 text-sm text-red-600">{errors.gdprConsent.message}</p>
        )}
      </div>

      <div className="mb-6">
        <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken(null)} />
      </div>

      {submitError && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">{submitError}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <Send className="h-5 w-5" />
            {formLabels.formSubmitButtonText}
          </>
        )}
      </button>
    </form>
  );
}
