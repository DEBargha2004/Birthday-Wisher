'use client'

import EntryForm from '@/components/custom/EntryForm'
import { wishSchema } from '@/schema/new-entry'
import { z } from 'zod'

export default function Page ({ params }: { params: string }) {
  function handleSubmit (data: z.infer<typeof wishSchema>) {
    console.log(data)
  }
  return <EntryForm onSubmit={handleSubmit} />
}
