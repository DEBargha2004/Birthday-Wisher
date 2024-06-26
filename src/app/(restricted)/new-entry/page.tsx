'use client'

import EntryForm from '@/components/custom/EntryForm'
import { wishSchema } from '@/schema/new-entry'
import { z } from 'zod'
import handleNewWishSubmit from '@/server-actions/handle-new-wish-submit'
import { useToast } from '@/components/ui/use-toast'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export default function Page () {
  const { toast } = useToast()
  async function handleSubmit (data: z.infer<typeof wishSchema>) {
    const res = await handleNewWishSubmit({
      ...data,
      birthday: format(new Date(data.dob), 'dd MMM')
    })

    toast({
      title: res.msg.title,
      description: res.msg.description,
      variant: res.success ? 'default' : 'destructive'
    })

    setTimeout(() => (window.location.href = '/home'), 3000)
  }

  return (
    <>
      <EntryForm onSubmit={handleSubmit} />
    </>
  )
}
