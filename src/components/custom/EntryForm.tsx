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
import { Calendar } from '../ui/calendar'

export default function EntryForm ({
  defaultValues,
  onSubmit
}: {
  defaultValues?: z.infer<typeof wishSchema>
  onSubmit: (data: z.infer<typeof wishSchema>) => void
}) {
  const form = useForm<z.infer<typeof wishSchema>>({
    resolver: zodResolver(wishSchema),
    defaultValues: defaultValues || {
      firstname: '',
      lastname: '',
      dob: undefined,
      message: '',
      whatsapp: undefined
    }
  })

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
                whatsapp: data.whatsapp
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
                  <FormLabel>LastName</FormLabel>
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
                          {field.value?.toDateString() || 'Enter Date Of Birth'}
                          <CalendarDays className='h-5' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea id={field.name} className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='whatsapp'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Whatsapp Number</FormLabel>
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
            <Button type='submit' className='w-full '>
              {form.formState.isSubmitting ? (
                <Loader2 className='animate-spin' />
              ) : null}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
