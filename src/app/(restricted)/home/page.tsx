'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
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

export default function Page () {
  const { user } = useUser()
  const getUser = useMutation(api.users.getUser)
  const createUser = useMutation(api.users.createUser)
  const wishes = useQuery(api.wishes.getWishes, { user_id: user?.id || '' })

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {wishes?.map(wish => (
            <TableRow key={wish._id}>
              {wishesTable.map(item => (
                <TableCell key={item.id}>
                  {wish[item.id as keyof typeof wish] || '—'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
