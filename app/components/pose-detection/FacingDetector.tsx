'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as poseDetection from '@tensorflow-models/pose-detection'
import Webcam from 'react-webcam'

import { useMN } from '@/app/contexts/mn-context'
import { estimateOrientation } from '@/app/lib/orient'
import { drawPose } from '@/app/lib/poseDrawing'

interface FacingFeedback {
  angle: number
  message: string
  isCorrect: boolean
}

export default function FacingDetector() {
  const { detector, isLoading, error } = useMN()
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fps, setFps] = useState<number>(0)
  const [feedback, setFeedback] = useState<FacingFeedback>({
    angle: 0,
    message: '请面向摄像头',
    isCorrect: false,
  })

  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  const updateFacingFeedback = useCallback((pose: poseDetection.Pose) => {
    const { angle, direction, isValid } = estimateOrientation(pose)

    setFeedback({
      angle,
      message: direction,
      isCorrect: isValid,
    })
  }, [])

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
    if (!webcamRef.current || isLoading || error || !detector) return

    let animationFrameId: number

    async function detectPose() {
      if (!detector || webcamRef.current?.video?.readyState !== 4) return

      const poses = await detector.estimatePoses(webcamRef.current.video, {
        flipHorizontal: false,
      })

      if (poses.length > 0) {
        drawPoseCallback(poses[0])
        updateFacingFeedback(poses[0])
      }
      updateFps()
      animationFrameId = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [
    detector,
    isLoading,
    error,
    drawPoseCallback,
    updateFps,
    updateFacingFeedback,
  ])

  if (isLoading) return <div>Loading pose detection model...</div>
  if (error)
    return <div>Error loading pose detection model: {error.message}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">正面检测</h1>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <div
            className={`absolute inset-0 border-4 ${feedback.isCorrect ? 'border-green-500' : 'border-red-500'} z-10`}
          ></div>
          <Webcam ref={webcamRef} className="w-full" />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />

          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
            FPS: {fps}
          </div>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded flex flex-col items-center">
            <div className="text-lg">{feedback.message}</div>
            <div className="text-sm">
              旋转角度: {Math.round(feedback.angle)}°
            </div>
          </div>
        </div>
      </div>{' '}
    </div>
  )
}
