import { wishSchema } from '@/schema/new-entry'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { CalendarDays, Loader2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useToast } from '../ui/use-toast'
import { useUser } from '@clerk/nextjs'
import CustomCalendar from './custom-calendar'

export default function EntryForm ({
  defaultValues,
  onSubmit
}: {
  defaultValues?: z.infer<typeof wishSchema>
  onSubmit: (data: z.infer<typeof wishSchema>) => void
}) {
  const form = useForm<z.infer<typeof wishSchema>>({
    resolver: zodResolver(wishSchema)
  })
  const { toast } = useToast()
  const { user } = useUser()

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState({
    message_generate: false
  })

  const getWishMessage = useAction(api.wishes.generateWishMessage)

  const handleCreateWishMessage = async () => {
    setLoading(prev => ({ ...prev, message_generate: true }))
    try {
      const res = await getWishMessage({
        prompt,
        id: user?.id || '',
        dob: format(new Date(form.getValues('dob')), 'dd MMM'),
        user_name: form.getValues('firstname')
      })

      if (res.success) {
        form.setValue('message', res.message)
      } else {
        toast({
          title: res.title,
          description: res.description,
          variant: 'destructive'
        })
      }
    } catch (error) {
      // console.log(error)

      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later',
        variant: 'destructive'
      })
    }

    setLoading(prev => ({ ...prev, message_generate: false }))
  }

  useEffect(() => {
    form.setValue('dob', defaultValues?.dob || '')
    form.setValue('phone', defaultValues?.phone || '')
    form.setValue('email', defaultValues?.email || '')
    form.setValue('firstname', defaultValues?.firstname || '')
    form.setValue('lastname', defaultValues?.lastname || '')
    form.setValue('message', defaultValues?.message || '')
  }, [defaultValues])

  return (
    <main className='flex justify-center items-center'>
      <div className='h-full lg:w-1/3 md:w-1/2 w-full'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data =>
              onSubmit({
                dob: data.dob,
                firstname: data.firstname,
                lastname: data.lastname,
                message: data.message,
                phone: data.phone,
                email: data.email
              })
            )}
            className='space-y-4 py-4'
          >
            <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type='text'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LastName (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      type='text'
                      className='w-full'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dob'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className='w-full flex justify-between'>
                          {field.value
                            ? format(new Date(field.value), 'PPPP')
                            : 'Enter Date Of Birth'}
                          <CalendarDays className='h-5' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <CustomCalendar
                          fieldValue={field.value}
                          onDateSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <>
                      <Textarea id={field.name} className='w-full' {...field} />
                      <div className='w-full flex items-center gap-2'>
                        <Input
                          value={prompt}
                          onChange={e => setPrompt(e.target.value)}
                          placeholder='Custom Instructions'
                        />
                        <Button
                          disabled={
                            !(form.watch('firstname') && form.watch('dob'))
                          }
                          onClick={handleCreateWishMessage}
                          type='button'
                        >
                          {loading.message_generate ? (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          ) : null}
                          Gen AI
                        </Button>
                      </div>
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      {...field}
                      type='number'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id={field.name}
                      {...field}
                      type='email'
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full '>
              {form.formState.isSubmitting ? (
                <Loader2 className='animate-spin mr-2 h-4 w-4' />
              ) : null}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
