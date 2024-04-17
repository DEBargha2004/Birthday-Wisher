import { format } from 'date-fns'

type WishTableItem = {
  title: string
  id: string
  process: (data: any) => any
}

export const wishesTable: WishTableItem[] = [
  {
    id: 'firstname',
    title: 'First Name',
    process: (data: string) => data
  },
  {
    id: 'lastname',
    title: 'Last Name',
    process: (data: string) => data
  },
  {
    id: 'birthday',
    title: 'Birthday',
    process: (data: string) => data
  },
  {
    id: 'dob',
    title: 'Date of Birth',
    process: (data: string) => format(new Date(data), 'PPPP')
  },
  {
    id: 'message',
    title: 'Message',
    process: (data: string) => data
  },
  {
    id: 'last_wished',
    title: 'Last Wished',
    process: (data: string) => data
  }
]
