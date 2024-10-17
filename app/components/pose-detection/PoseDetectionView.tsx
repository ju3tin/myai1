'use client'

import { Settings } from './Settings'
import { SimilarityChart } from './SimilarityChart'
import { TargetImage } from './TargetImage'
import { WebcamView } from './WebcamView'

export function PoseDetectionView() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="flex-1">
          <TargetImage />
        </div>
        <div className="flex-1">
          <WebcamView />
        </div>
      </div>
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="flex-1">
          <Settings />
        </div>
        <div className="flex-1">
          <SimilarityChart />
        </div>
      </div>
    </div>
  )
}
