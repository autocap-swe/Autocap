import { z } from 'zod';

const NAME_REGEX = /^[a-zA-ZäöåÄÖÅæøÆØéèêëàâüùûïîÿœ'\- ]+$/;
const SUBJECT_SAFE_REGEX = /^[^<>{}|\\^~[\]`]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]+$/;

export const generalContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(100, 'Name must be 100 characters or less')
    .regex(NAME_REGEX, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
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
      PHONE_REGEX,
      'Phone number can only contain numbers, spaces, +, -, and parentheses'
    )
    .optional(),
  subject: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(200, 'Subject must be 200 characters or less')
    .regex(SUBJECT_SAFE_REGEX, 'Subject contains unsupported special characters'),
  message: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(2000, 'Message must be 2000 characters or less'),
  gdprConsent: z.boolean().refine(val => val === true, 'You must agree to the privacy policy'),
});

export type GeneralContactFormData = z.infer<typeof generalContactFormSchema>;