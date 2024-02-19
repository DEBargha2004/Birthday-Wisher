'use client'

import { createContext } from 'react'

const GlobalAppStateContext = createContext({})

export default function GlobalAppStateProvider ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <GlobalAppStateContext.Provider value={{}}>
      {children}
    </GlobalAppStateContext.Provider>
  )
}
