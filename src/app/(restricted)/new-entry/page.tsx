'use client'

import EntryForm from '@/components/custom/EntryForm'
import { wishSchema } from '@/schema/new-entry'
import { z } from 'zod'
import handleNewWishSubmit from '@/server-actions/handle-new-wish-submit'
import { useToast } from '@/components/ui/use-toast'
import { redirect } from 'next/navigation'

export default function Page () {
  const { toast } = useToast()
  async function handleSubmit (data: z.infer<typeof wishSchema>) {
    const res = await handleNewWishSubmit(data)
    setTimeout(() => {
      redirect('/home')
    }, 2500)
    toast({
      title: res.msg.title,
      description: res.msg.description,
      variant: res.success ? 'default' : 'destructive'
    })
  }

  return (
    <>
      <EntryForm onSubmit={handleSubmit} />
    </>
  )
}
