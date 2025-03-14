import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from '@/app/components/ui/toaster'

import { Layout } from './components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PoseDetector.com - Advanced AI Pose Detection',
  description:
    'Cutting-edge AI-powered pose detection for fitness, dance, healthcare, and rehabilitation',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
