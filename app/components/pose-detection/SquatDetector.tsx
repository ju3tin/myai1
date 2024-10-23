'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import { drawPose as dp } from '@/app/lib/poseDrawing'
import { detectSquat, SquatPhase } from '@/app/lib/squatDetection'

interface SquatFeedback {
  isCorrect: boolean
  message: string
}

export default function SquatDetector() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [fps, setFps] = useState<number>(0)
  const [squatCount, setSquatCount] = useState<number>(0)
  const [feedback, setFeedback] = useState<SquatFeedback>({
    isCorrect: true,
    message: 'Start squatting!',
  })
  const squatPhase = useRef<SquatPhase>(SquatPhase.STANDING)

  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  useEffect(() => {
    async function initDetector() {
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
    }
    initDetector()
  }, [])

  const drawPose = useCallback((pose: poseDetection.Pose) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

    dp(ctx, [pose], video.videoWidth, video.videoHeight)
  }, [])

  const updateFps = useCallback(() => {
    const now = performance.now()
    const elapsed = now - lastFpsUpdateTime.current
    frameCount.current++

    if (elapsed > 1000) {
      setFps(Math.round((frameCount.current * 1000) / elapsed))
      frameCount.current = 0
      lastFpsUpdateTime.current = now
    }
  }, [])

  const detectSquatCallback = useCallback(
    (pose: poseDetection.Pose) => {
      detectSquat({
        pose,
        squatPhase,
        setSquatCount,
        setFeedback,
      })
    },
    [setSquatCount, setFeedback]
  )

  useEffect(() => {
    if (!detector || !webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video
        if (detector && video.readyState === 4) {
          const poses = await detector.estimatePoses(video)
          if (poses.length > 0) {
            drawPose(poses[0])
            detectSquatCallback(poses[0])
          }
          updateFps()
        }
      }
      animationFrameId = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [detector, drawPose, updateFps, detectSquatCallback])

  return (
    <div className="relative">
      <div
        className={`absolute inset-0 border-4 ${feedback.isCorrect ? 'border-green-500' : 'border-red-500'} z-10`}
      ></div>
      <Webcam ref={webcamRef} className="w-full" mirrored />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
        FPS: {fps}
      </div>
      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
        Squats: {squatCount}
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded">
        {feedback.message}
      </div>
    </div>
  )
}
