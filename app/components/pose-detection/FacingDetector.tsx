'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import { drawPose } from '@/app/lib/poseDrawing'

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

  const calculateFacingAngle = useCallback((pose: poseDetection.Pose) => {
    const leftShoulder = pose.keypoints.find(
      (kp) => kp.name === 'left_shoulder'
    )
    const rightShoulder = pose.keypoints.find(
      (kp) => kp.name === 'right_shoulder'
    )

    if (
      !leftShoulder ||
      !rightShoulder ||
      !leftShoulder.x ||
      !rightShoulder.x
    ) {
      return { angle: 0, isValid: false }
    }

    // 计算肩膀距离比例来估算旋转角度
    const shoulderDistance = Math.abs(leftShoulder.x - rightShoulder.x)
    const normalizedDistance =
      shoulderDistance / (webcamRef.current?.video?.videoWidth || 640)

    // 将距离转换为角度（0度表示正面）
    const angle = (1 - normalizedDistance * 2) * 90

    return { angle, isValid: true }
  }, [])

  const updateFacingFeedback = useCallback(
    (pose: poseDetection.Pose) => {
      const { angle, isValid } = calculateFacingAngle(pose)

      if (!isValid) {
        setFeedback({
          angle: 0,
          message: '无法检测到肩膀位置',
          isCorrect: false,
        })
        return
      }

      const absAngle = Math.abs(angle)
      let message = ''
      let isCorrect = false

      if (absAngle < 15) {
        message = '完美！保持正面姿势'
        isCorrect = true
      } else if (angle > 0) {
        message = '请向右转'
        isCorrect = false
      } else {
        message = '请向左转'
        isCorrect = false
      }

      setFeedback({
        angle,
        message,
        isCorrect,
      })
    },
    [calculateFacingAngle]
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
