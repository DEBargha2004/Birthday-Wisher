'use server'

import { wishSchema } from '@/schema/new-entry'
import { z } from 'zod'
import { api } from '../../convex/_generated/api'
import { currentUser } from '@clerk/nextjs'
import { ResponseType } from '@/types/response'
import { fetchMutation } from 'convex/nextjs'
import { format } from 'date-fns'
import { Id } from '../../convex/_generated/dataModel'

export default async function handleEditWish (
  data: Partial<z.infer<typeof wishSchema>> & { wish_id: Id<'wishes'> }
): Promise<ResponseType> {
  const user = await currentUser()

  const wish = await fetchMutation(api.wishes.checkWishWithId, {
    id: data.wish_id
  })
  console.log(wish)
  if (user?.id) {
    if (!wish) {
      return {
        success: false,
        msg: {
          title: "Wish Doesn't Exists",
          description: "Wish with this id doesn't exists"
        }
      }
    } else {
      console.log(data)

      await fetchMutation(api.wishes.updateWish, {
        wish_id: wish._id,
        ...(data.firstname ? { firstName: data.firstname } : {}),
        ...(data.lastname ? { lastName: data.lastname } : {}),
        ...(data.dob
          ? {
              dob: data.dob.toUTCString(),
              birthday: format(new Date(data.dob), 'dd MMM')
            }
          : {}),
        ...(data.message ? { message: data.message } : {}),
        ...(data.phone ? { phone: Number(data.phone) } : {}),
        ...(data.email ? { email: data.email } : {})
      })
      return {
        success: true,
        msg: {
          title: 'Wish Updated',
          description: 'Wish updated successfully'
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
