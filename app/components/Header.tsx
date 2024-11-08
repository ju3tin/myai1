import Link from 'next/link'

import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          RehabMotion
        </Link>
        <nav className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Mediapipe+BlazePose</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/pose-comparison">Pose Comparison</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/mp-pose-detection">MediaPipe Pose</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">TFJS+MoveNet</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/squat-detection">Squat Detection</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pose-detection">Pose Detection</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/facing-detection">Facing Detection</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">TFJS+BlazePose</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href="/pose-detection-3d">3D Pose Detection</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
}
