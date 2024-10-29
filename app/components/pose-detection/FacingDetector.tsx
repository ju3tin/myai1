'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import { drawPose } from '@/app/lib/poseDrawing'
import { estimateOrientation } from '@/app/lib/orient'

interface FacingFeedback {
  angle: number
  message: string
  isCorrect: boolean
}

export default function FacingDetector() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [fps, setFps] = useState<number>(0)
  const [feedback, setFeedback] = useState<FacingFeedback>({
    angle: 0,
    message: '请面向摄像头',
    isCorrect: false,
  })

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

  const updateFacingFeedback = useCallback(
    (pose: poseDetection.Pose) => {
      const { angle, direction, isValid } = estimateOrientation(pose)

      
      setFeedback({
        angle,
        message: direction,
        isCorrect: isValid,
      })
    },
    []
  )

  const drawPoseCallback = useCallback((pose: poseDetection.Pose) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

    drawPose(ctx, [pose], video.videoWidth, video.videoHeight)
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

  useEffect(() => {
    if (!webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (!detector) return // Ensure detector is not null
      if (webcamRef.current?.video?.readyState === 4) {
        const poses = await detector.estimatePoses(webcamRef.current.video, {
          flipHorizontal: true,
        })

        if (poses.length > 0) {
          drawPoseCallback(poses[0])
          updateFacingFeedback(poses[0])
        }
        updateFps()
      }
      animationFrameId = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [detector, drawPoseCallback, updateFps, updateFacingFeedback])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div
          className={`absolute inset-0 border-4 ${feedback.isCorrect ? 'border-green-500' : 'border-red-500'} z-10`}
        ></div>
        <Webcam ref={webcamRef} className="w-full" mirrored />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />

        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
          FPS: {fps}
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded flex flex-col items-center">
          <div className="text-lg">{feedback.message}</div>
          <div className="text-sm">旋转角度: {Math.round(feedback.angle)}°</div>
        </div>
      </div>
    </div>
  )
}
