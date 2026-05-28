import { z } from 'zod';

const NAME_REGEX = /^[a-zA-ZäöåÄÖÅæøÆØéèêëàâüùûïîÿœ'\- ]+$/;

export const entrepreneurFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(100, 'Name must be 100 characters or less')
    .regex(NAME_REGEX, 'Name can only contain letters, spaces, hyphens, and apostrophes'),

  workshopName: z
    .string()
    .trim()
    .min(1, 'Workshop name is required')
    .min(2, 'Workshop name must be at least 2 characters'),

  cityRegion: z
    .string()
    .trim()
    .min(1, 'City/region is required')
    .min(2, 'City/region must be at least 2 characters'),

  revenue: z.enum(['€0 - €500k', '€500k - €1M', '€1M - €3M', '€3M+'], {
    message: 'Please select your approximate annual revenue',
  }),

  email: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .min(7, 'Please enter a valid phone number')
    .regex(
      /^[\d\s\-+()]+$/,
      'Phone number can only contain numbers, spaces, dashes, and parentheses'
    ),

  message: z.string().trim().max(2000, 'Message must be 2000 characters or less').optional(),

  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'You must accept the privacy policy to continue',
  }),
});

export type EntrepreneurFormData = z.infer<typeof entrepreneurFormSchema>;
