'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

const RUNNING_MODE = 'VIDEO' as const

interface MPPoseDetectorContextType {
  poseLandmarker: PoseLandmarker | null
  isLoading: boolean
  error: Error | null
}

const MPPoseDetectorContext = createContext<MPPoseDetectorContextType>({
  poseLandmarker: null,
  isLoading: true,
  error: null,
})

export function MPPoseDetectorProvider({ children }: { children: ReactNode }) {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    async function initializePoseLandmarker() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
        )

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: 'GPU',
          },
          runningMode: RUNNING_MODE,
          numPoses: 1,
        })

        setPoseLandmarker(landmarker)
        setIsLoading(false)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to initialize pose detector')
        )
        setIsLoading(false)
      }
    }

    initializePoseLandmarker()
  }, [])

  return (
    <MPPoseDetectorContext.Provider
      value={{
        poseLandmarker,
        isLoading,
        error,
      }}
    >
      {children}
    </MPPoseDetectorContext.Provider>
  )
}

export function useMPPoseDetector() {
  const context = useContext(MPPoseDetectorContext)
  if (!context) {
    throw new Error(
      'useMPPoseDetector must be used within MPPoseDetectorProvider'
    )
  }
  return context
}
