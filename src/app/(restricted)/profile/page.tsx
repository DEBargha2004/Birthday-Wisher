'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { userProfileSchema } from '@/schema/user-profile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export default function Page () {
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema)
  })

  const handleSubmit = (data: z.infer<typeof userProfileSchema>) => {
    console.log(data)
  }
  return (
    <section className='h-full w-full flex flex-col justify-start items-center'>
      <h1 className='text-3xl mb-8 w-1/3'>Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='w-1/3 space-y-2'
        >
          <FormField
            control={form.control}
            name='firstname'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='First Name' {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Last Name' {...field} />
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
                  <Input placeholder='Email' type='email' {...field} />
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
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Phone'
                    type='number'
                    {...field}
                    onChange={e => {
                      if (e.target.value.length <= 10) {
                        field.onChange(Number(e.target.value))
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='resend_api_key'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resend API Key</FormLabel>
                <FormControl>
                  <Input placeholder='Resend API Key' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='w-full'>
            <Button type='submit' variant={'default'} className='w-full my-5'>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
