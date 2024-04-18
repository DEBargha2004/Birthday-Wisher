import * as Z from 'zod'

export const wishSchema = Z.object({
  firstname: Z.string({ required_error: 'First name is required' }),
  lastname: Z.string().optional(),
  dob: Z.string({ required_error: 'Date of Birth is required' }),
  message: Z.string().optional(),
  phone: Z.union([
    Z.string({
      required_error: 'Phone number is required'
    }),
    Z.number({
      required_error: 'Phone number is required'
    })
  ]),
  email: Z.string()
})
