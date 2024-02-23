import * as Z from 'zod'

export const wishSchema = Z.object({
  firstname: Z.string({ required_error: 'First name is required' }),
  lastname: Z.string().optional(),
  dob: Z.date({ required_error: 'Date of Birth is required' }),
  message: Z.string().optional(),
  whatsapp: Z.union([
    Z.string({
      required_error: 'Whatsapp number is required'
    }),
    Z.number({
      required_error: 'Whatsapp number is required'
    })
  ])
})
