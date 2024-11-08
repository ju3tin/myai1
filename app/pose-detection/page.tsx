'use client'

import { PoseDetectionView } from '@/app/components/pose-detection/PoseDetectionView'
import { MNProvider } from '@/app/contexts/mn-context'

export default function PoseDetectionPage() {
  return (
    <MNProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pose Detection</h1>
        <PoseDetectionView />
      </div>
    </MNProvider>
  )
}
