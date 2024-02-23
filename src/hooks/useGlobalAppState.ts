'use client'

import { GlobalAppStateContext } from '@/providers/global-app-state-provider'
import { GlobalAppStateType } from '@/types/global-app-state'
import { useContext } from 'react'

export default function useGlobalAppState () {
  return useContext(GlobalAppStateContext) as GlobalAppStateType
}
