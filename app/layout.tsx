import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from '@/app/components/ui/toaster'

import { Layout } from './components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RehabMotion',
  description: 'AI-powered rehabilitation exercises',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
