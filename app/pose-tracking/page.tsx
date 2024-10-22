'use client'

import SquatDetector from '@/app/components/pose-detection/SquatDetector'

export default function PoseTrackingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Squat Detection</h1>
      <SquatDetector />
    </div>
  )
}
