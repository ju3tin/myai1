'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

import * as poseDetection from '@tensorflow-models/pose-detection'
import Image from 'next/image'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { useMN } from '@/app/contexts/mn-context'
import { drawPose as dp } from '@/app/lib/poseDrawing'

import { RealTimeResults } from '../RealTimeResults'

export function ExerciseView() {
  const { detector, isLoading, error } = useMN()

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [poses, setPoses] = useState<poseDetection.Pose[]>([])
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isBrowserReady, setIsBrowserReady] = useState(false)
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  const drawPose = useCallback(
    (poses: poseDetection.Pose[]) => {
      const ctx = canvasRef.current?.getContext('2d')
      const video = webcamRef.current?.video
      if (!ctx || !video) return

      dp(ctx, poses, video.videoWidth, video.videoHeight, false)
    },
    [webcamRef]
  )

  const updateFps = useCallback(() => {
    const now = performance.now()
    const elapsed = now - lastFpsUpdateTime.current
    frameCount.current++

    if (elapsed > 1000) {
      // Update FPS every second
      setFps(Math.round((frameCount.current * 1000) / elapsed))
      frameCount.current = 0
      lastFpsUpdateTime.current = now
    }
  }, [])

  useEffect(() => {
    if (!detector || !webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (!detector || !webcamRef.current?.video) return
      const video = webcamRef.current.video
      if (
        video.readyState === 4 &&
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {
        try {
          const newPoses = await detector.estimatePoses(video, {
            flipHorizontal: false,
          })
          setPoses(newPoses)
          drawPose(newPoses)
          updateFps()
        } catch (error) {
          console.error('Error estimating poses:', error)
        }
      }
      animationFrameId = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [detector, drawPose, updateFps])

  useEffect(() => {
    if (webcamRef.current) {
      console.log('Webcam ref is set')
    }
  }, [])

  useEffect(() => {
    setIsBrowserReady(true)
  }, [])

  const captureScreenshot = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot()
      setScreenshot(imageSrc)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to RehabMotion</h1>
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {isLoading && (
            <div className="flex justify-center items-center h-full">
              <p>Loading Models...</p>
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center h-full">
              <p className="text-red-500">Error: {error.message}</p>
            </div>
          )}
          {!isLoading && !error && isBrowserReady ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Camera View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Webcam
                        ref={webcamRef}
                        className="w-full"
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          facingMode: 'user',
                        }}
                        onUserMedia={() => {
                          console.log('Camera access granted')
                        }}
                        onUserMediaError={(err) => {
                          console.error('Camera error:', err)
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
                    <Button onClick={captureScreenshot} className="mt-4">
                      Capture Screenshot
                    </Button>
                  </CardContent>
                </Card>
                {screenshot && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Captured Screenshot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Image
                        src={screenshot}
                        alt="Captured screenshot"
                        width={640}
                        height={480}
                        className="w-full"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
              <RealTimeResults poses={poses} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
