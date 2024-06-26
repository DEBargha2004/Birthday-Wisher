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
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from 'convex/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { api } from '../../../../convex/_generated/api'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function Page () {
  const [showApiKey, setShowApiKey] = useState({
    resend_api_key: false,
    genai_api_key: false
  })
  const { user } = useUser()
  const router = useRouter()
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema)
  })

  const getUser = useMutation(api.users.getUser)
  const updateUser = useMutation(api.users.updateUser)

  const handleSubmit = async (data: z.infer<typeof userProfileSchema>) => {
    // console.log(data)

    if (user) {
      const res = await updateUser({ user_id: user.id, ...data })
      if (res) {
        toast({
          title: 'Profile Updated',
          description: 'Profile updated successfully',
          variant: 'default'
        })

        router.push('/home')
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Please try again later',
          variant: 'destructive'
        })
      }
    } else {
      toast({
        title: 'User Id not found',
        description: 'Please login again or refresh the page',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    if (user?.id) {
      getUser({ id: user.id }).then(userInfo => {
        for (const key in userInfo) {
          // @ts-ignore
          form.setValue(key, userInfo[key])
        }
      })
    }
  }, [user])
  return (
    <section className='h-full w-full flex flex-col justify-center items-center'>
      <div className='h-full lg:w-1/3 md:w-1/2 w-full'>
        <h1 className='text-3xl mb-8 w-1/3'>Profile</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className=' space-y-2'
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
                  <FormControl className=''>
                    <div className='w-full flex flex-col items-start  gap-2'>
                      <Input
                        placeholder='Resend API Key'
                        {...field}
                        type={showApiKey.resend_api_key ? 'text' : 'password'}
                      />
                      <Input
                        type='checkbox'
                        className='h-3 mx-0 w-fit '
                        checked={showApiKey.resend_api_key}
                        onChange={() =>
                          setShowApiKey(prev => ({
                            ...prev,
                            resend_api_key: !prev.resend_api_key
                          }))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='genai_api_key'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GenAI API Key</FormLabel>
                  <FormControl className=''>
                    <div className='w-full flex flex-col items-start  gap-2'>
                      <Input
                        placeholder='Google Generative AI API Key'
                        {...field}
                        type={showApiKey.genai_api_key ? 'text' : 'password'}
                      />
                      <Input
                        type='checkbox'
                        className='h-3 mx-0 w-fit '
                        checked={showApiKey.genai_api_key}
                        onChange={() =>
                          setShowApiKey(prev => ({
                            ...prev,
                            genai_api_key: !prev.genai_api_key
                          }))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='w-full'>
              <Button type='submit' variant={'default'} className='w-full my-5'>
                {form.formState.isSubmitting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : null}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}
