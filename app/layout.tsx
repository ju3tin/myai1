import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from '@/app/components/ui/toaster'

import JsonLd from './components/JsonLd'
import { Layout } from './components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PoseDetector.com - Advanced AI Pose Detection',
  description:
    'Cutting-edge AI-powered pose detection for fitness, dance, healthcare, and rehabilitation. Improve your form with real-time feedback and analysis.',
  keywords:
    'pose detection, AI, machine learning, fitness, dance, healthcare, rehabilitation, motion tracking, posture analysis',
  authors: [{ name: 'PoseDetector Team' }],
  creator: 'PoseDetector.com',
  publisher: 'PoseDetector.com',
  metadataBase: new URL('https://posedetector.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'PoseDetector.com - Advanced AI Pose Detection',
    description:
      'Cutting-edge AI-powered pose detection for fitness, dance, healthcare, and rehabilitation',
    url: 'https://posedetector.com',
    siteName: 'PoseDetector',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://posedetector.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PoseDetector.com - Advanced AI Pose Detection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoseDetector.com - Advanced AI Pose Detection',
    description:
      'Cutting-edge AI-powered pose detection for fitness, dance, healthcare, and rehabilitation',
    images: ['https://posedetector.com/og-image.png'],
    creator: '@posedetector',
  },
  verification: {
    google: 'google-site-verification-code', // 替换为您的 Google 验证码
  },
  category: 'Technology',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <JsonLd />
      </head>
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
