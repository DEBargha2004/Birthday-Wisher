import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { AlignJustify } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import useGlobalAppState from '@/hooks/useGlobalAppState'
import { sidebarItems } from '@/constants/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Switch from './Switch'
import { useTheme } from 'next-themes'

export default function Navbar ({ className }: { className?: string }) {
  const { navbarOpen, setNavbarOpen } = useGlobalAppState()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  return (
    <div
      className={cn(
        'px-3 py-2 h-full flex justify-between items-center',
        className
      )}
    >
      <Sheet open={navbarOpen} onOpenChange={setNavbarOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            className='hover:bg-muted px-2 transition-all border'
          >
            <AlignJustify />
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='px-0'>
          <div className=' h-full  mx-2 space-y-2'>
            <div className='h-full mt-4 border-b border-slate-300 max-h-[80%] overflow-y-auto'>
              {sidebarItems.map(item => {
                return (
                  <Link key={item.title} href={item.link} className=''>
                    <div
                      className={cn(
                        'py-2 px-2 font-medium my-1 transition-all rounded',
                        pathname.includes(item.link)
                          ? 'bg-slate-200 dark:bg-muted-foreground'
                          : 'hover:bg-muted'
                      )}
                    >
                      {item.title}
                    </div>
                  </Link>
                )
              })}
            </div>
            <div>
              <Switch
                on={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='cursor-pointer'
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Link href={'/new-entry'}>
        <Button>Add New</Button>
      </Link>
    </div>
  )
}
