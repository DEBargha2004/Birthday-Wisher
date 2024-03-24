'use server'

import { userProfileSchema } from '@/schema/user-profile'
import { auth } from '@clerk/nextjs'
import { fetchMutation } from 'convex/nextjs'
import * as z from 'zod'
import { api } from '../../convex/_generated/api'

export default async function handleUserProfileSubmit (
  data: z.infer<typeof userProfileSchema>
) {
  const { user } = auth()
  const { success } = userProfileSchema.safeParse(data)

  if (user?.id && success) {
    const res = await fetchMutation(api.users.updateUser, {
      user_id: user.id,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname || '',
      phone: data.phone,
      resend_api_key: data.resend_api_key
    })

    return res
  }
}
