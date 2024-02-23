'use client'

import Navbar from '@/components/custom/Navbar'
import useGlobalAppState from '@/hooks/useGlobalAppState'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function RestrictedLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { setNavbarOpen } = useGlobalAppState()

  useEffect(() => {
    setNavbarOpen(false)
  }, [pathname])
  return (
    <div className='h-full'>
      <div className='h-[10%] w-full'>
        <Navbar />
      </div>
      <div className='h-[90%] w-full px-4'>{children}</div>
    </div>
  )
}
