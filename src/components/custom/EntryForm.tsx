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
import { ChangeEvent, useMemo, useState } from 'react'
import { format, parse } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

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
      phone: ''
    }
  })

  const [dateObj, setDateObj] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth()
  })

  const months = useMemo(() => {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }, [])

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
                          {field.value?.toDateString() || 'Enter Date Of Birth'}
                          <CalendarDays className='h-5' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className='w-full flex justify-evenly items-center gap-2'>
                          <Select
                            onValueChange={val =>
                              setDateObj(prev => ({
                                ...prev,
                                month: parseInt(val)
                              }))
                            }
                            value={dateObj.month.toString()}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Month' />
                            </SelectTrigger>
                            <SelectContent className='max-h-80'>
                              <SelectGroup>
                                {months.map((month, month_idx) => (
                                  <SelectItem
                                    value={(month_idx + 1).toString()}
                                    key={month}
                                  >
                                    {month}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Select
                            onValueChange={val =>
                              setDateObj(prev => ({
                                ...prev,
                                year: parseInt(val)
                              }))
                            }
                            value={dateObj.year.toString()}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Year' />
                            </SelectTrigger>
                            <SelectContent className='max-h-80'>
                              <SelectGroup>
                                {Array.from(
                                  {
                                    length: new Date().getFullYear() + 1 - 1900
                                  },
                                  (_, i) => i + 1900
                                ).map(year => (
                                  <SelectItem
                                    value={year.toString()}
                                    key={year}
                                  >
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          month={
                            new Date(
                              dateObj.month.toString() +
                                '/01/' +
                                dateObj.year.toString()
                            )
                          }
                          onMonthChange={date => {
                            console.log(date.getMonth())

                            setDateObj(prev => ({
                              ...prev,
                              month: date.getMonth() + 1,
                              year: date.getFullYear()
                            }))
                          }}
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
                    <Textarea id={field.name} className='w-full' {...field} />
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
                  <FormLabel>Email (Optional)</FormLabel>
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
