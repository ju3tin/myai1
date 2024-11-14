'use client'

import { useState } from 'react'

import { PosePractice } from '@/app/components/pose-training/PosePractice'
import { PoseReport } from '@/app/components/pose-training/PoseReport'
import { PoseSetup } from '@/app/components/pose-training/PoseSetup'
import { useMPPoseDetector } from '@/app/contexts/MPPoseDetectorContext'
import { cn } from '@/app/lib/utils'
import type { PoseCheckConfig, PracticeResult } from '@/app/types/pose-training'
export function PoseTraining() {
  const [activeTab, setActiveTab] = useState<'setup' | 'practice' | 'report'>(
    'setup'
  )
  const [standardImage, setStandardImage] = useState<string>('')
  const [poseChecks, setPoseChecks] = useState<PoseCheckConfig[]>([])
  const [practiceResults, setPracticeResults] = useState<PracticeResult[]>([])

  const { poseLandmarker, isLoading, error } = useMPPoseDetector()

  if (isLoading) return <div>Loading pose detector...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <TabButton
          isActive={activeTab === 'setup'}
          onClick={() => setActiveTab('setup')}
        >
          Setup
        </TabButton>
        <TabButton
          isActive={activeTab === 'practice'}
          onClick={() => setActiveTab('practice')}
          disabled={!standardImage || poseChecks.length === 0}
        >
          Practice
        </TabButton>
        <TabButton
          isActive={activeTab === 'report'}
          onClick={() => setActiveTab('report')}
          disabled={practiceResults.length === 0}
        >
          Report
        </TabButton>
      </div>

      <div className="mt-4">
        {activeTab === 'setup' && (
          <PoseSetup
            standardImage={standardImage}
            setStandardImage={setStandardImage}
            poseChecks={poseChecks}
            setPoseChecks={setPoseChecks}
            poseLandmarker={poseLandmarker}
          />
        )}
        {activeTab === 'practice' && (
          <PosePractice
            poseChecks={poseChecks}
            setPracticeResults={setPracticeResults}
            poseLandmarker={poseLandmarker}
          />
        )}
        {activeTab === 'report' && (
          <PoseReport
            practiceResults={practiceResults}
            poseChecks={poseChecks}
          />
        )}
      </div>
    </div>
  )
}

function TabButton({
  children,
  isActive,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}
