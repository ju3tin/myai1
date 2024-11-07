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
            <Link href="/pose-tracking">Squat Detection</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pose-detection">Pose Detection</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/facing-detection">Facing Detection</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pose-detection-3d">3D Pose Detection</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/mp-pose-detection">MediaPipe Pose</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
