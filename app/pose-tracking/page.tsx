'use client'

import SquatDetector from '@/app/components/pose-detection/SquatDetector'
import { MNProvider } from '../contexts/mn-context'

export default function PoseTrackingPage() {
  return (
    <MNProvider>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Squat Detection</h1>
      <SquatDetector />
    </div>
    </MNProvider>
  )
}
