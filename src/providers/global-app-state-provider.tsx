'use client'

import { createContext, useState } from 'react'

export const GlobalAppStateContext = createContext({})

export default function GlobalAppStateProvider ({
  children
}: {
  children: React.ReactNode
}) {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false)
  return (
    <GlobalAppStateContext.Provider value={{ navbarOpen, setNavbarOpen }}>
      {children}
    </GlobalAppStateContext.Provider>
  )
}
