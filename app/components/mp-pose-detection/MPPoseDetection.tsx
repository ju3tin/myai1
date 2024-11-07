'use client'

import { useEffect, useRef, useState } from 'react'

import { DrawingUtils, PoseLandmarker } from '@mediapipe/tasks-vision'
import Webcam from 'react-webcam'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { useMPPoseDetector } from '@/app/contexts/MPPoseDetectorContext'

export function MPPoseDetection() {
  const { poseLandmarker, isLoading, error } = useMPPoseDetector()
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [fps, setFps] = useState(0)
  const lastFpsUpdate = useRef(performance.now())
  const frameCount = useRef(0)

  useEffect(() => {
    if (
      !poseLandmarker ||
      !webcamRef.current?.video ||
      !isDetecting
    )
      return

    let animationFrame: number

    const detectPose = async () => {
      console.log('detectPose')
      const video = webcamRef.current?.video
      if (!video || video.readyState !== 4) return

      const startTimeMs = performance.now()

      try {
        await poseLandmarker.setOptions({ runningMode: 'VIDEO' })
        console.log('detecting pose', poseLandmarker)
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          const ctx = canvasRef.current?.getContext('2d')
          if (!ctx) return

          ctx.save()
          ctx.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          )
          const drawingUtils = new DrawingUtils(ctx)
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) =>
                DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
            })
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS
            )
          }

          ctx.restore()
        })

        // Update FPS
        frameCount.current++
        const now = performance.now()
        if (now - lastFpsUpdate.current > 1000) {
          setFps(
            Math.round(
              (frameCount.current * 1000) / (now - lastFpsUpdate.current)
            )
          )
          frameCount.current = 0
          lastFpsUpdate.current = now
        }
      } catch (err) {
        console.error('Error detecting pose:', err)
      }

      animationFrame = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [poseLandmarker, isDetecting])

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        Loading pose detector...
      </div>
    )
  if (error)
    return (
      <div className="flex justify-center items-center h-full w-full">
        Error: {error.message}
      </div>
    )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>MediaPipe Pose Detection</CardTitle>
          <div className="flex items-center space-x-2">
            <Switch
              id="pose-detection"
              checked={isDetecting}
              onCheckedChange={setIsDetecting}
            />
            <Label htmlFor="pose-detection">Detection</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Webcam
            ref={webcamRef}
            className="w-full"
            audio={false}
            videoConstraints={{
              facingMode: 'user',
            }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        <div className="mt-2 top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
          FPS: {fps}
        </div>
      </CardContent>
    </Card>
  )
}
