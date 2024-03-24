import * as z from 'zod'

export const userProfileSchema = z.object({
  firstname: z.string({ required_error: 'First name is required' }),
  lastname: z.string().optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  phone: z.number({ required_error: 'Phone number is required' }),
  resend_api_key: z.string({ required_error: 'Resend API key is required' })
})
