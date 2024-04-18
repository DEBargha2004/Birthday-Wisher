'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { wishesTable } from '@/constants/wishes-table'
import { Button } from '@/components/ui/button'
import { Grip, Loader2, Pen, Trash2 } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { Id } from '../../../../convex/_generated/dataModel'
import Link from 'next/link'

export default function Page () {
  const { user } = useUser()
  const [loading, setLoading] = useState({
    delete_wish: false
  })
  const getUser = useMutation(api.users.getUser)
  const createUser = useMutation(api.users.createUser)
  const wishes = useQuery(api.wishes.getWishes, { user_id: user?.id || '' })
  const deleteWish = useMutation(api.wishes.deleteWish)

  const handleDelete = async (id: Id<'wishes'>) => {
    setLoading(prev => ({ ...prev, delete_wish: true }))
    await deleteWish({ wish_id: id })
    setLoading(prev => ({ ...prev, delete_wish: false }))
  }

  useEffect(() => {
    if (user?.id) {
      getUser({ id: user.id }).then(res => {
        if (!res?.user_id) {
          createUser({
            user_id: user.id,
            firstname: user.firstName || '',
            lastname: user.lastName || '',
            email: user.primaryEmailAddress?.emailAddress || ''
          })
        }
      })
    }
  }, [user])
  return (
    <main className='px-4 pt-8'>
      <Table>
        <TableHeader>
          <TableRow>
            {wishesTable.map(item => (
              <TableHead key={item.id}>{item.title}</TableHead>
            ))}
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishes?.map(wish => (
            <TableRow key={wish._id}>
              {wishesTable.map(item => (
                <TableCell key={item.id} className='max-w-[400px]'>
                  <div className='line-clamp-6'>
                    {item.process(wish[item.id as keyof typeof wish]) || '—'}
                  </div>
                </TableCell>
              ))}
              <TableCell>
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <Grip className='cursor-pointer' />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <Link href={`/edit/${wish._id}`}>
                      <ContextMenuItem>
                        <Pen className='mr-1 h-4 w-4' />
                        &nbsp; Edit
                      </ContextMenuItem>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <ContextMenuItem onSelect={e => e.preventDefault()}>
                          <Trash2 className='mr-1 h-4 w-4' />
                          &nbsp; Delete
                        </ContextMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>Delete Wish</DialogHeader>
                        <DialogDescription>
                          Are you sure you want to delete this wish?
                        </DialogDescription>
                        <DialogFooter>
                          <DialogClose>
                            <Button variant={'secondary'}>Cancel</Button>
                          </DialogClose>
                          <Button
                            variant={'destructive'}
                            onClick={() => handleDelete(wish._id)}
                          >
                            {loading.delete_wish ? (
                              <Loader2 className='mr-1 h-4 s-4 animate-spin' />
                            ) : null}
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </ContextMenuContent>
                </ContextMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
