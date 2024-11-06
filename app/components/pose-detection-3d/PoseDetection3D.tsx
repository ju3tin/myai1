'use client'

import { useRef, useState, useEffect } from 'react'

import Webcam from 'react-webcam'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { usePoseDetector } from '@/app/contexts/PoseDetectorContext'
import { draw3DPose } from '@/app/lib/pose3DDrawing'

interface KeypointData {
  name: string
  score: number
  x: number
  y: number
  z: number
}

export function PoseDetection3D() {
  const { detector, isLoading: isDetectorLoading } = usePoseDetector()
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [fps, setFps] = useState(0)
  const lastFpsUpdate = useRef(performance.now())
  const frameCount = useRef(0)
  const [keypointsData, setKeypointsData] = useState<KeypointData[]>([])

  useEffect(() => {
    if (!detector || !webcamRef.current || !isDetecting) return

    let animationFrame: number

    async function detectPose() {
      if (!webcamRef.current?.video) return

      const video = webcamRef.current.video
      if (video.readyState === 4) {
        try {
          const poses = await detector?.estimatePoses(video, {
            flipHorizontal: false,
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

          // Draw poses and update keypoints data
          if (poses && poses.length > 0 && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')
            if (ctx) {
              
              draw3DPose(
                ctx,
                poses[0],
                video.videoWidth,
                video.videoHeight,
                false
              )

              // Update keypoints data
              const newKeypointsData = poses[0].keypoints.map((kp) => ({
                name: kp.name || 'unknown',
                score: Number(kp.score?.toFixed(2)) || 0,
                x: Number(kp.x?.toFixed(2)) || 0,
                y: Number(kp.y?.toFixed(2)) || 0,
                z: Number(kp.z?.toFixed(2)) || 0,
              }))
              setKeypointsData(newKeypointsData)
            }
          }
        } catch (error) {
          console.error('Error detecting pose:', error)
        }
      }

      animationFrame = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [detector, isDetecting])

  return (
    <Card>
      {isDetectorLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white">
          Loading...
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>3D Pose Detection</CardTitle>
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
      <CardContent className="relative">
        <Webcam
          ref={webcamRef}
          className="object-contain w-full"
          audio={false}
          videoConstraints={{
            width: 1280,
            height: 800,
            facingMode: 'user',
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
        />
        <div className="mt-2 top-2 left-2 bg-black bg-opacity-60 text-white p-2 rounded max-h-[calc(100%-16px)] overflow-y-auto w-64">
          <h3 className="font-semibold mb-2">Keypoints Data</h3>
          {keypointsData.map((kp, index) => (
            <div key={index} className="text-xs mb-1">
              <div className="font-medium">{kp.name}</div>
              <div>Score: {kp.score}</div>
              <div>
                X: {kp.x}, Y: {kp.y}, Z: {kp.z}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
          FPS: {fps}
        </div>
      </CardContent>
    </Card>
  )
}
