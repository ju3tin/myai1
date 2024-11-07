'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'

import '@tensorflow/tfjs-backend-webgl'

interface MNContextType {
  detector: poseDetection.PoseDetector | null
  isLoading: boolean
  error: Error | null
}

const MNContext = createContext<MNContextType | null>(null)

export function MNProvider({ children }: { children: React.ReactNode }) {
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function initDetector() {
      try {
        await tf.ready()
        await tf.setBackend('webgl')
        const modelConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          modelConfig
        )
        setDetector(detector)
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to init detector')
        )
      } finally {
        setIsLoading(false)
      }
    }
    initDetector()
  }, [])

  return (
    <MNContext.Provider value={{ detector, isLoading, error }}>
      {children}
    </MNContext.Provider>
  )
}

export function useMN() {
  const context = useContext(MNContext)
  if (!context) throw new Error('useMN must be used within MNProvider')
  return context
}
