import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/providers/convex-client-provider'
import GlobalAppStateProvider from '@/providers/global-app-state-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Birthdat Wisher',
  description: 'Your assistant for sending birthday wishes'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ConvexClientProvider>
            <GlobalAppStateProvider>{children}</GlobalAppStateProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
