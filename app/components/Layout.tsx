import { ReactNode } from 'react'

import dynamic from 'next/dynamic'

const Header = dynamic(() => import('@/app/components/Header'), { ssr: false })

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  )
}
