'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

export function WebcamView() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null)
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  const drawPose = useCallback((poses: poseDetection.Pose[]) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || poses.length === 0) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const video = webcamRef.current?.video
    if (video) {
      ctx.canvas.width = video.videoWidth
      ctx.canvas.height = video.videoHeight
    }

    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-ctx.canvas.width, 0)

    poses[0].keypoints.forEach((keypoint) => {
      if (keypoint.score && keypoint.score > 0.3) {
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()

        ctx.save()
        ctx.scale(-1, 1)
        ctx.font = '12px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText(keypoint.name ?? '', -keypoint.x + 5, keypoint.y - 5)
        ctx.restore()
      }
    })

    // Draw skeleton
    const skeleton = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle'],
    ]

    skeleton.forEach(([startPoint, endPoint]) => {
      const start = poses[0].keypoints.find((kp) => kp.name === startPoint)
      const end = poses[0].keypoints.find((kp) => kp.name === endPoint)
      if (
        start &&
        end &&
        start.score &&
        end.score &&
        start.score &&
        end.score &&
        start.score > 0.3 &&
        end.score > 0.3
      ) {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.lineTo(end.x, end.y)
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    ctx.restore()
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
    async function initDetector() {
      await tf.ready()
      await tf.setBackend('webgl')
      const modelConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, modelConfig)
      setDetector(detector)
    }
    initDetector()
  }, [])

  useEffect(() => {
    if (!detector || !webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video
        if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0 && detector) {
          try {
            const poses = await detector.estimatePoses(video)
            drawPose(poses)
            updateFps()
          } catch (error) {
            console.error('Error estimating poses:', error)
          }
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
  }, [detector, drawPose, updateFps])

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Webcam View</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-2 overflow-hidden">
        <div className="relative">
          {isLoading && (
            <p className="absolute inset-0 flex items-center justify-center">
              Loading camera...
            </p>
          )}
          {error && (
            <p className="absolute inset-0 flex items-center justify-center text-red-500">
              Error: {error}
            </p>
          )}
          <Webcam
            ref={webcamRef}
            mirrored
            className="object-contain"
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1200,
              height: 800,
              facingMode: 'user',
            }}
            onUserMedia={() => {
              console.log('Camera access granted')
              setIsLoading(false)
            }}
            onUserMediaError={(err) => {
              console.error('Camera error:', err)
              setError('Failed to access camera')
              setIsLoading(false)
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white p-2 rounded">
            FPS: {fps}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
