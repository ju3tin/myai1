'use client'

import { useCallback } from 'react'

import { PoseLandmarker } from '@mediapipe/tasks-vision'

import { PoseCheckCard } from '@/app/components/pose-training/PoseCheckCard'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import type { PoseCheckConfig } from '@/app/types/pose-training'

interface PoseSetupProps {
  standardImage: string
  setStandardImage: (image: string) => void
  poseChecks: PoseCheckConfig[]
  setPoseChecks: (checks: PoseCheckConfig[]) => void
  poseLandmarker: PoseLandmarker | null
}

export function PoseSetup({
  standardImage,
  setStandardImage,
  poseChecks,
  setPoseChecks,
  poseLandmarker,
}: PoseSetupProps) {
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setStandardImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    [setStandardImage]
  )

  const addPoseCheck = useCallback(
    (type: PoseCheckConfig['type']) => {
      setPoseChecks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type,
          ...(type === 'angle'
            ? {
                joints: ['', '', ''],
                comparison: 'equal' as const,
                targetValue: 0,
              }
            : type === 'height'
              ? {
                  points: ['', ''],
                  tolerance: 0,
                }
              : type === 'duration'
                ? {
                    durationRange: { min: 0, max: 0 },
                  }
                : type === 'count'
                  ? {
                      countRange: { min: 0, max: 0 },
                    }
                  : {}),
        } as PoseCheckConfig,
      ])
    },
    [setPoseChecks]
  )

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Standard Pose</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-48"
          />
          {standardImage && (
            <div className="relative w-128 h-128">
              <img
                src={standardImage}
                alt="Standard pose"
                className="object-contain w-full h-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pose Checks</h2>
        <div className="flex space-x-2">
          <Button onClick={() => addPoseCheck('angle')}>Add Angle Check</Button>
          <Button onClick={() => addPoseCheck('height')}>
            Add Height Check
          </Button>
          <Button onClick={() => addPoseCheck('duration')}>Add Duration</Button>
          <Button onClick={() => addPoseCheck('count')}>Add Count</Button>
        </div>

        <div className="space-y-4">
          {poseChecks.map((check) => (
            <PoseCheckCard
              key={check.id}
              check={check}
              onUpdate={(updated) => {
                setPoseChecks((prev) =>
                  prev.map((c) => (c.id === check.id ? updated : c))
                )
              }}
              onDelete={() => {
                setPoseChecks((prev) => prev.filter((c) => c.id !== check.id))
              }}
              poseLandmarker={poseLandmarker}
              standardImage={standardImage}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
