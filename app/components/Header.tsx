import Link from 'next/link'

import { Button } from '@/app/components/ui/button'

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          RehabMotion
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/exercises">Exercises</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/progress">Progress</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
