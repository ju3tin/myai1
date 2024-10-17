'use client'

import { useRef, useState, useEffect, useCallback, RefObject } from 'react'

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
import { drawPose } from '@/app/lib/poseDrawing'

interface WebcamViewProps {
  targetImageRef: RefObject<HTMLImageElement>
  targetCanvasRef: RefObject<HTMLCanvasElement>
}

export function WebcamView({
  targetImageRef,
  targetCanvasRef,
}: WebcamViewProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(0)
  const [targetPose, setTargetPose] = useState<poseDetection.Pose | null>(null)

  useEffect(() => {
    lastFpsUpdateTime.current = performance.now()
  }, [])

  const drawPoseOnCanvas = useCallback((poses: poseDetection.Pose[]) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

    drawPose(ctx, poses, video.videoWidth, video.videoHeight)
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

  useEffect(() => {
    if (!detector || !webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video
        if (
          video.readyState === 4 &&
          video.videoWidth > 0 &&
          video.videoHeight > 0 &&
          detector
        ) {
          try {
            const poses = await detector.estimatePoses(video)
            drawPoseOnCanvas(poses)
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
  }, [detector, drawPoseOnCanvas, updateFps])

  useEffect(() => {
    if (!detector || !targetImageRef.current) return

    async function detectTargetPose() {
      if (targetImageRef.current && detector) {
        try {
          // 等待图像加载完成
          if (!targetImageRef.current.complete) {
            await new Promise((resolve) => {
              targetImageRef.current!.onload = resolve
            })
          }

          // 等待下一帧，确保图像已渲染
          await new Promise(requestAnimationFrame)

          // 使用 canvas 进行姿势估计
          const poses = await detector.estimatePoses(targetImageRef.current)

          console.log(poses)
          if (poses.length > 0) {
            setTargetPose(poses[0])
          }
        } catch (error) {
          console.error('Error estimating target pose:', error)
        }
      }
    }

    detectTargetPose()
  }, [detector, targetImageRef])

  const drawTargetPoseOnCanvas = useCallback(() => {
    const ctx = targetCanvasRef.current?.getContext('2d')
    const targetImage = targetImageRef.current
    if (!ctx || !targetImage || !targetPose) return

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    // Save the current context state
    ctx.save()

    // Draw the image scaled to fit the canvas
    ctx.drawImage(targetImage, 0, 0, ctx.canvas.width, ctx.canvas.height)

    // Restore the context state
    ctx.restore()

    // Scale and flip the pose keypoints
    const scaledPose = {
      ...targetPose,
      keypoints: targetPose.keypoints.map((keypoint) => ({
        ...keypoint,
        x: ctx.canvas.width - keypoint.x,
        y: keypoint.y,
      })),
    }
    console.log(scaledPose)
    // Draw the scaled and flipped pose
    drawPose(ctx, [scaledPose], ctx.canvas.width, ctx.canvas.height)
  }, [targetPose, targetCanvasRef, targetImageRef])

  useEffect(() => {
    if (targetPose) {
      drawTargetPoseOnCanvas()
    }
  }, [targetPose, drawTargetPoseOnCanvas])

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Pose Detection</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-row p-2 overflow-hidden">
        <div className="flex-1 relative">
          <h3 className="text-lg font-semibold mb-2">Webcam View</h3>
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
