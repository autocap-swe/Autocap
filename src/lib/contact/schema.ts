import { z } from 'zod';

export const ContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
  gdprConsent: z.literal(true, {
    error: 'You must accept the privacy policy',
  }),
});

export type ContactFormData = z.infer<typeof ContactSchema>;

export const AnnualRevenue = z.enum(['<5 MSEK', '5-15 MSEK', '15-50 MSEK', '>50 MSEK'], {
  error: 'Invalid revenue range',
});

export const EntrepreneurSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  workshopName: z
    .string()
    .trim()
    .min(1, 'Workshop name is required')
    .max(200, 'Workshop name is too long'),
  cityRegion: z
    .string()
    .trim()
    .min(1, 'City/region is required')
    .max(100, 'City/region is too long'),
  revenue: AnnualRevenue,
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  phone: z.string().trim().min(1, 'Phone is required').max(30, 'Phone number is too long'),
  message: z.string().trim().max(5000, 'Message is too long').optional(),
  gdprConsent: z.literal(true, { error: 'You must accept the privacy policy' }),
});

export type EntrepreneurFormData = z.infer<typeof EntrepreneurSchema>;

export const EnquiryType = z.enum(['Investment', 'Partnership', 'Media', 'Other'], {
  error: 'Invalid enquiry type',
});

export const InvestorSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Name is too long'),
  organisation: z
    .string()
    .trim()
    .min(1, 'Organisation is required')
    .max(200, 'Organisation is too long'),
  role: z.string().trim().min(1, 'Role is required').max(100, 'Role is too long'),
  enquiryType: EnquiryType,
  email: z.string().trim().email('Invalid email address').max(254, 'Email is too long'),
  message: z.string().trim().max(5000, 'Message is too long').optional(),
  gdprConsent: z.literal(true, { error: 'You must accept the privacy policy' }),
});

export type InvestorFormData = z.infer<typeof InvestorSchema>;
