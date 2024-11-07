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

type RunningMode = 'IMAGE' | 'VIDEO'

export function MPPoseDetection() {
  const { poseLandmarker, isLoading, error } = useMPPoseDetector()
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const frameCount = useRef(0)
  const [runningMode, setRunningMode] = useState<RunningMode>('VIDEO')

  useEffect(() => {
    if (!poseLandmarker || !webcamRef.current?.video || !isDetecting) return

    let animationFrame: number
    let lastFrameTime = 0
    const targetFPS = 30 // Limit to 30 FPS
    const frameInterval = 1000 / targetFPS
    const ctx = canvasRef.current?.getContext('2d')

    const detectPose = async (timestamp: number) => {
      // Skip frame if too soon
      if (timestamp - lastFrameTime < frameInterval) {
        animationFrame = requestAnimationFrame(detectPose)
        return
      }

      const video = webcamRef.current?.video
      if (!video || video.readyState !== 4 || !ctx) {
        animationFrame = requestAnimationFrame(detectPose)
        return
      }

      // Request next frame early
      animationFrame = requestAnimationFrame(detectPose)
      lastFrameTime = timestamp

      if (canvasRef.current) {
        canvasRef.current.width = video.videoWidth
        canvasRef.current.height = video.videoHeight
      }

      try {
        poseLandmarker.detectForVideo(video, timestamp, (result) => {
          ctx.save()
          ctx.clearRect(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          )
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          const drawingUtils = new DrawingUtils(ctx)
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) =>
                DrawingUtils.lerp(data.from!.z, -0.5, 0.5, 3, 1),
              lineWidth: 1,
              color: '#00FF00',
              fillColor: '#00FF00',
            })
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS,
              {
                lineWidth: 1,
                color: '#00FF00',
              }
            )
          }
          ctx.restore()
        })

      } catch (err) {
        console.error('Error detecting pose:', err)
      }
    }

    animationFrame = requestAnimationFrame(detectPose)
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [poseLandmarker, isDetecting])

  useEffect(() => {
    if (!poseLandmarker) return
    poseLandmarker.setOptions({ runningMode })
  }, [poseLandmarker, runningMode])

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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="running-mode"
                checked={runningMode === 'VIDEO'}
                onCheckedChange={(checked) =>
                  setRunningMode(checked ? 'VIDEO' : 'IMAGE')
                }
              />
              <Label htmlFor="running-mode">
                {runningMode === 'VIDEO' ? 'Video' : 'Image'} Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="pose-detection"
                checked={isDetecting}
                onCheckedChange={setIsDetecting}
              />
              <Label htmlFor="pose-detection">Detection</Label>
            </div>
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
      </CardContent>
    </Card>
  )
}
