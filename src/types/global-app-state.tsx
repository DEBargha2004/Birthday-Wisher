import { Dispatch, SetStateAction } from 'react'

export type GlobalAppStateType = {
  navbarOpen: boolean
  setNavbarOpen: Dispatch<SetStateAction<boolean>>
}
