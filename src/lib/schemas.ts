import { z } from "zod"

// Invoice form schema
export const invoiceSchema = z.object({
  customerId: z.string().min(1, { message: "Customer is required." }),
  amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], { message: "Please select an invoice status." }),
  description: z.string().min(5, { message: "Description must be at least 5 characters." }),
})

// User profile form schema
export const userProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  age: z.coerce
    .number()
    .min(18, { message: "Must be at least 18 years old." })
    .max(120, { message: "Age must be realistic." }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters." }).optional(),
})

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  preferences: z.array(z.string()).min(1, { message: "Please select at least one preference." }),
})

// Workshop form schema
export const workshopSchema = z.object({
  name: z.string().min(1, { message: "Workshop name is required." }),
  slug: z.string().min(1, { message: "Slug is required." }),
  city: z.string().min(1, { message: "City is required." }),
  region: z.string().min(1, { message: "Region is required." }),
  latitude: z.coerce.number().min(-90).max(90, { message: "Invalid latitude." }),
  longitude: z.coerce.number().min(-180).max(180, { message: "Invalid longitude." }),
  acquisitionStatus: z.enum(["acquired", "pending", "target"], {
    message: "Please select an acquisition status.",
  }),
  yearAcquired: z
    .string()
    .regex(/^\d{4}$/, { message: "Year must be exactly 4 digits." })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(1800, { message: "Year must be 1800 or later." })
        .max(new Date().getFullYear() + 1, {
          message: "Year cannot be in the future.",
        })
    ),
  localWebsite: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

// Define types for form states
export type FormState = {
  errors?: Record<string, string[]>
  message?: string
  success?: boolean
}

export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type UserProfileFormData = z.infer<typeof userProfileSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type WorkshopFormData = z.infer<typeof workshopSchema>