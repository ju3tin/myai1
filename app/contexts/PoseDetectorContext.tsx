'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-backend-webgl'
import '@mediapipe/pose'

interface PoseDetectorContextType {
  detector: poseDetection.PoseDetector | null
  isLoading: boolean
  error: string | null
}

const PoseDetectorContext = createContext<PoseDetectorContextType>({
  detector: null,
  isLoading: true,
  error: null,
})

export function PoseDetectorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    async function initializeDetector() {
      if (initialized.current) return
      initialized.current = true

      try {
        await tf.ready()
        await tf.setBackend('webgl')

        const model = poseDetection.SupportedModels.BlazePose
        const detectorConfig: poseDetection.BlazePoseMediaPipeModelConfig = {
          runtime: 'mediapipe',
          modelType: 'full',
          solutionPath: '/pose',
          enableSmoothing: true,
        }

        const detector = await poseDetection.createDetector(
          model,
          detectorConfig
        )
        setDetector(detector)
      } catch (err) {
        console.error('Failed to initialize pose detector:', err)
        setError('Failed to initialize pose detector')
      } finally {
        setIsLoading(false)
      }
    }

    initializeDetector()

    return () => {
      if (detector) {
        detector.dispose()
      }
    }
  }, [detector])

  return (
    <PoseDetectorContext.Provider value={{ detector, isLoading, error }}>
      {children}
    </PoseDetectorContext.Provider>
  )
}

export function usePoseDetector() {
  return useContext(PoseDetectorContext)
}
