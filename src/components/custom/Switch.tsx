import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { SunMedium, SunMoon, Sun } from 'lucide-react'

export default function Switch ({
  on,
  onChange,
  className
}: {
  on?: boolean
  onChange: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-14 h-7 p-[2px] rounded-full bg-stone-300 dark:bg-stone-700 flex',
        className,
        on ? 'justify-end' : 'justify-start'
      )}
      onClick={onChange}
    >
      <motion.div
        layout
        className='h-full aspect-square rounded-full bg-primary-foreground inset-1 flex justify-center items-center'
      >
        {on ? (
          <SunMoon className='h-5 aspect-square' />
        ) : (
          <Sun className='h-5 aspect-square' />
        )}
      </motion.div>
    </div>
  )
}
