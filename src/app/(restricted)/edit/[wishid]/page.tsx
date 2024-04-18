'use client'

import EntryForm from '@/components/custom/EntryForm'
import { wishSchema } from '@/schema/new-entry'
import { useEffect, useState } from 'react'
import * as z from 'zod'
import { getWishes } from '../../../../../convex/wishes'
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import handleEditWish from '@/server-actions/handle-edit-wish'
import { useToast } from '@/components/ui/use-toast'

export default function Page ({ params }: { params: { wishid: Id<'wishes'> } }) {
  const checkWishWithId = useMutation(api.wishes.checkWishWithId)
  const { toast } = useToast()

  const [defaultWishData, setDefaultWishData] =
    useState<z.infer<typeof wishSchema>>()

  async function handleSubmit (data: z.infer<typeof wishSchema>) {
    const res = await handleEditWish({
      wish_id: params.wishid,
      ...(defaultWishData?.firstname !== data.firstname
        ? { firstname: data.firstname }
        : {}),
      ...(defaultWishData?.lastname !== data.lastname
        ? { lastname: data.lastname }
        : {}),
      ...(defaultWishData?.dob !== data.dob ? { dob: data.dob } : {}),
      ...(defaultWishData?.message !== data.message
        ? { message: data.message }
        : {}),
      ...(defaultWishData?.phone !== data.phone ? { phone: data.phone } : {}),
      ...(defaultWishData?.email !== data.email ? { email: data.email } : {})
    })

    toast({
      title: res.msg.title,
      description: res.msg.description
    })

    setTimeout(() => (window.location.href = '/home'), 3000)
  }

  useEffect(() => {
    checkWishWithId({ id: params.wishid }).then(data =>
      setDefaultWishData({
        firstname: data?.firstname || '',
        lastname: data?.lastname || '',
        dob: data?.dob || '',
        message: data?.message || '',
        phone: data?.phone?.toString() || '',
        email: data?.email || ''
      })
    )
  }, [params])

  return <EntryForm onSubmit={handleSubmit} defaultValues={defaultWishData} />
}
