'use server'

import { wishSchema } from '@/schema/new-entry'
import { z } from 'zod'
import { api } from '../../convex/_generated/api'
import { currentUser } from '@clerk/nextjs'
import { ResponseType } from '@/types/response'
import { fetchMutation } from 'convex/nextjs'
import { format } from 'date-fns'

export default async function handleNewWishSubmit (
  data: z.infer<typeof wishSchema>
): Promise<ResponseType> {
  const user = await currentUser()

  const wish = await fetchMutation(api.wishes.checkWish, {
    whatsapp: Number(data.phone)
  })
  if (user?.id) {
    if (wish) {
      return {
        success: false,
        msg: {
          title: 'Wish Exists',
          description: 'Wish with this whatsapp number already exists'
        }
      }
    } else {
      console.log(data)

      await fetchMutation(api.wishes.createWish, {
        creator_id: user.id,
        firstname: data.firstname,
        lastname: data.lastname || '',
        dob: data.dob.toUTCString(),
        birthday: format(new Date(data.dob), 'dd MMM'),
        message: data.message || '',
        phone: Number(data.phone),
        email: data.email
      })
      return {
        success: true,
        msg: {
          title: 'Wish Added',
          description: 'Wish added successfully'
        }
      }
    }
  } else {
    return {
      success: false,
      msg: {
        title: 'User Not Found',
        description: 'Id does not exist'
      }
    }
  }
}

// addWish()
