import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Page () {
  return (
    <main className='h-full w-full flex flex-col items-center justify-center '>
      <p className='text-4xl font-semibold'>Birthday Wishher</p>
      <Link href='/home' className='mt-4'>
        <Button
          variant={'default'}
          className='text-2xl font-medium bg-violet-600 text-white p-6 hover:bg-violet-800'
        >
          Dashboard
        </Button>
      </Link>
    </main>
  )
}
