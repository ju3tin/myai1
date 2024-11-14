'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { PoseLandmarker } from '@mediapipe/tasks-vision'
import Webcam from 'react-webcam'

import { Card } from '@/app/components/ui/card'
import { calculateAngle, calculateHeightDifference } from '@/app/lib/pose-utils'
import type { PoseCheckConfig, PracticeResult } from '@/app/types/pose-training'
import { POSE_JOINTS } from '@/app/types/pose-training'

interface PosePracticeProps {
  poseChecks: PoseCheckConfig[]
  setPracticeResults: (results: PracticeResult[]) => void
  poseLandmarker: PoseLandmarker | null
}

export function PosePractice({
  poseChecks,
  setPracticeResults,
  poseLandmarker,
}: PosePracticeProps) {
  const webcamRef = useRef<Webcam>(null)
  const requestRef = useRef<number>()
  const [isDetecting, setIsDetecting] = useState(false)
  const [currentResults, setCurrentResults] = useState<Record<string, number>>(
    {}
  )
  const [durations, setDurations] = useState<Record<string, number>>({})
  const [counts, setCounts] = useState<Record<string, number>>({})
  const lastPassingTimeRef = useRef<Record<string, number>>({})

  const detectPose = useCallback(async () => {
    if (!webcamRef.current || !poseLandmarker) return

    const video = webcamRef.current.video
    if (!video || !video.videoWidth || !video.videoHeight) return

    const result = await poseLandmarker.detectForVideo(video, performance.now())
    if (!result.landmarks?.[0]) return

    const newResults: Record<string, number> = {}
    const currentTime = performance.now()

    poseChecks.forEach((check) => {
      if (check.type === 'angle' && check.joints) {
        const angle = calculateAngle(
          result.landmarks[0][
            POSE_JOINTS.findIndex((j) => j.name === check.joints![0])
          ],
          result.landmarks[0][
            POSE_JOINTS.findIndex((j) => j.name === check.joints![1])
          ],
          result.landmarks[0][
            POSE_JOINTS.findIndex((j) => j.name === check.joints![2])
          ]
        )
        newResults[check.id] = angle

        // Check if angle meets criteria
        const isPassing =
          check.comparison === 'greater'
            ? angle > check.targetValue
            : check.comparison === 'less'
              ? angle < check.targetValue
              : Math.abs(angle - check.targetValue) <= (check.tolerance || 5)

        // Update duration
        if (isPassing) {
          if (!lastPassingTimeRef.current[check.id]) {
            lastPassingTimeRef.current[check.id] = currentTime
          }
          const duration =
            (currentTime - lastPassingTimeRef.current[check.id]) / 1000
          setDurations((prev) => ({ ...prev, [check.id]: duration }))
        } else {
          lastPassingTimeRef.current[check.id] = 0
          setDurations((prev) => ({ ...prev, [check.id]: 0 }))
        }
      }

      if (check.type === 'height' && check.points) {
        const heightDiff = calculateHeightDifference(
          result.landmarks[0][
            POSE_JOINTS.findIndex((j) => j.name === check.points![0])
          ],
          result.landmarks[0][
            POSE_JOINTS.findIndex((j) => j.name === check.points![1])
          ]
        )
        newResults[check.id] = heightDiff

        const isPassing =
          Math.abs(heightDiff - (check.standardValue || 0)) <=
          (check.tolerance || 0.1)

        if (isPassing) {
          if (!lastPassingTimeRef.current[check.id]) {
            lastPassingTimeRef.current[check.id] = currentTime
          }
          const duration =
            (currentTime - lastPassingTimeRef.current[check.id]) / 1000
          setDurations((prev) => ({ ...prev, [check.id]: duration }))
        } else {
          lastPassingTimeRef.current[check.id] = 0
          setDurations((prev) => ({ ...prev, [check.id]: 0 }))
        }
      }
    })

    setCurrentResults(newResults)
    requestRef.current = requestAnimationFrame(detectPose)
  }, [poseChecks, poseLandmarker])

  useEffect(() => {
    if (isDetecting) {
      requestRef.current = requestAnimationFrame(detectPose)
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [detectPose, isDetecting])

  const handleStartStop = () => {
    setIsDetecting((prev) => !prev)
    if (!isDetecting) {
      // Reset all tracking when starting
      lastPassingTimeRef.current = {}
      setDurations({})
      setCounts({})
    } else {
      // Save results when stopping
      const results: PracticeResult[] = poseChecks.map((check) => ({
        checkId: check.id,
        timestamp: Date.now(),
        value: currentResults[check.id] || 0,
        isPassing:
          check.type === 'duration'
            ? (durations[check.id] || 0) >= (check.durationRange?.min || 0)
            : check.type === 'count'
              ? (counts[check.id] || 0) >= (check.countRange?.min || 0)
              : false,
        duration: durations[check.id],
        count: counts[check.id],
      }))
      setPracticeResults(results)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="relative aspect-video">
          <Webcam ref={webcamRef} className="w-full h-full" mirrored />
        </div>
        <button
          onClick={handleStartStop}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {isDetecting ? 'Stop Practice' : 'Start Practice'}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Real-time Results</h2>
        {poseChecks.map((check) => (
          <Card key={check.id} className="p-4">
            <h3 className="font-medium">
              {check.type.charAt(0).toUpperCase() + check.type.slice(1)} Check
            </h3>
            {check.type === 'angle' && (
              <div>
                <p>Current angle: {currentResults[check.id]?.toFixed(1)}°</p>
                <p>
                  Target: {check.comparison} {check.targetValue}°
                </p>
                {check.durationRange && (
                  <p>
                    Duration: {durations[check.id]?.toFixed(1)}s /{' '}
                    {check.durationRange.min}s
                  </p>
                )}
              </div>
            )}
            {check.type === 'height' && (
              <div>
                <p>
                  Current difference: {currentResults[check.id]?.toFixed(3)}
                </p>
                <p>
                  Target difference: {check.standardValue?.toFixed(3)} ±{' '}
                  {check.tolerance}
                </p>
                {check.durationRange && (
                  <p>
                    Duration: {durations[check.id]?.toFixed(1)}s /{' '}
                    {check.durationRange.min}s
                  </p>
                )}
              </div>
            )}
            {check.type === 'duration' && (
              <div>
                <p>Current duration: {durations[check.id]?.toFixed(1)}s</p>
                <p>
                  Target: {check.durationRange?.min}s -{' '}
                  {check.durationRange?.max}s
                </p>
              </div>
            )}
            {check.type === 'count' && (
              <div>
                <p>Current count: {counts[check.id] || 0}</p>
                <p>
                  Target: {check.countRange?.min} - {check.countRange?.max}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
