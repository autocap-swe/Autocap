import { z } from 'zod';

const NAME_REGEX = /^[a-zA-ZäöåÄÖÅæøÆØéèêëàâüùûïîÿœ'\- ]+$/;

export const ENQUIRY_TYPES = ['Investment', 'Partnership', 'Media', 'Other'] as const;

export const investorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .max(100, 'Name must be 100 characters or less')
    .regex(NAME_REGEX, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  organization: z.string().trim().min(1, 'Please enter your organization or fund name'),
  role: z.string().trim().min(1, 'Please enter your role or title'),
  enquiryType: z.enum(ENQUIRY_TYPES, { message: 'Please select an enquiry type' }),
  email: z
    .string()
    .trim()
    .min(1, 'This field is required')
    .email('Please enter a valid email address'),
  phone: z.string().trim().min(1, 'Please enter your phone number'),
  message: z.string().trim().max(2000, 'Message must be 2000 characters or less').optional(),
  gdprConsent: z.boolean().refine(val => val === true, {
    message: 'You must consent to data processing to submit this form',
  }),
});

export type InvestorFormData = z.infer<typeof investorFormSchema>;
