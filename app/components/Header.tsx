import { Activity, Zap, Brain, Menu } from 'lucide-react'
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
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2"
        >
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          PoseDetector.com
        </Link>
        <nav className="hidden md:flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-4 hover:bg-purple-50 hover:text-purple-700"
              >
                <Activity className="h-4 w-4" />
                <span>Mediapipe+BlazePose</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl p-2 bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-purple-50"
              >
                <Link
                  href="/pose-comparison"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Pose Comparison</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-purple-50"
              >
                <Link
                  href="/mp-pose-detection"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>MediaPipe Pose</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-4 hover:bg-blue-50 hover:text-blue-700"
              >
                <Zap className="h-4 w-4" />
                <span>TFJS+MoveNet</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl p-2 bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Link
                  href="/pose-tracking"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Squat Tracking</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Link
                  href="/pose-detection"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Pose Detection</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Link
                  href="/facing-detection"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Facing Detection</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Link
                  href="/mn-pose-comparison"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>MoveNet Comparison</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-4 hover:bg-pink-50 hover:text-pink-700"
              >
                <Brain className="h-4 w-4" />
                <span>TFJS+BlazePose</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl p-2 bg-white shadow-lg border border-gray-200">
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-pink-50"
              >
                <Link
                  href="/pose-detection-3d"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-pink-600" />
                  </div>
                  <span>3D Pose Detection</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-pink-50"
              >
                <Link
                  href="/tm-pose-comparison"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-pink-600" />
                  </div>
                  <span>BlazePose Comparison</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl p-2 bg-white shadow-lg border border-gray-200"
            >
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-purple-50"
              >
                <Link
                  href="/pose-comparison"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Pose Comparison</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-blue-50"
              >
                <Link
                  href="/pose-detection"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Pose Detection</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="rounded-lg cursor-pointer hover:bg-pink-50"
              >
                <Link
                  href="/pose-detection-3d"
                  className="flex items-center gap-2 py-2"
                >
                  <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-pink-600" />
                  </div>
                  <span>3D Pose Detection</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
