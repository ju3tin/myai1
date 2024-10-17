'use client'

import { PoseDetectionView } from '@/app/components/pose-detection/PoseDetectionView'

export default function PoseDetectionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pose Detection</h1>
      <PoseDetectionView />
    </div>
  )
}
