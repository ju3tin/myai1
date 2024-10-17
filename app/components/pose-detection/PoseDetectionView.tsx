'use client'

import { useRef } from 'react'

import { Settings } from './Settings'
import { SimilarityChart } from './SimilarityChart'
import { TargetImage } from './TargetImage'
import { WebcamView } from './WebcamView'

export function PoseDetectionView() {
  const targetImageRef = useRef<HTMLImageElement>(null)
  const targetCanvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)]">
      <div className="flex-1 flex p-4 space-x-4">
        <div className="w-1/3 flex flex-col h-full min-h-full">
          <div className="mb-4">
            <Settings />
          </div>
          <div className="mb-4">
            <SimilarityChart />
          </div>
          <div className="">
            <WebcamView
              targetImageRef={targetImageRef}
              targetCanvasRef={targetCanvasRef}
            />
          </div>
        </div>
        <div className="flex-1 relative h-full min-h-full">
          <TargetImage
            targetImageRef={targetImageRef}
            targetCanvasRef={targetCanvasRef}
          />
        </div>
      </div>
    </div>
  )
}
