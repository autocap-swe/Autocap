import { z } from 'zod';

const NAME_REGEX = /^[a-zA-ZäöåÄÖÅæøÆØéèêëàâüùûïîÿœ'\- ]+$/;
const SUBJECT_SAFE_REGEX = /^[^<>{}|\\^~[\]`]+$/;

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
