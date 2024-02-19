import { ReactNode } from 'react'

export default function RootLayout ({ children }: { children: ReactNode }) {
  return (
    <section className='w-full h-full flex justify-center items-center'>
      {children}
    </section>
  )
}
