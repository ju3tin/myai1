'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as mpPose from '@mediapipe/pose'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import '@tensorflow/tfjs-backend-webgpu'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { RealTimeResults } from './RealTimeResults'
import { Button } from '@/app/components/ui/button'
import Image from 'next/image'
import { SettingsPopover, SettingData } from './settings-popover'
import { useToast } from '@/app/hooks/use-toast'

export default function ExerciseView() {
  const { toast } = useToast()

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [poses, setPoses] = useState<poseDetection.Pose[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isBrowserReady, setIsBrowserReady] = useState(false)
  const [settings, setSettings] = useState<SettingData>({
    model: 'MoveNet',
    modelVariant: 'lightning',
    runtime: 'tfjs-webgl',
  })
  const [fps, setFps] = useState<number>(0)
  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  const handleSettingsChange = (newSettings: SettingData) => {
    setSettings(newSettings)
    // 在这里可以进行其他操作，如更新模型或运行时
  }

  useEffect(() => {
    console.log('settings', settings)
  }, [settings])

  const drawPose = useCallback(
    (poses: poseDetection.Pose[]) => {
      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || poses.length === 0) return

      // Clear the canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      // Set canvas size to match video
      const video = webcamRef.current?.video
      if (video) {
        ctx.canvas.width = video.videoWidth
        ctx.canvas.height = video.videoHeight
      }

      // Flip the context horizontally
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-ctx.canvas.width, 0)

      poses[0].keypoints.forEach((keypoint) => {
        if (keypoint.score && keypoint.score > 0.3) {
          // Draw keypoint
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = 'red'
          ctx.fill()

          // Draw keypoint name (need to flip text back)
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

      // Restore the context
      ctx.restore()
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
    async function resetBackend(backendName: string) {
      const ENGINE = tf.engine()
      if (!(backendName in ENGINE.registryFactory)) {
        toast({
          title: 'Fail',
          description: `${backendName} backend is not registered.`,
        })
        return
      }

      if (backendName in ENGINE.registry) {
        const backendFactory = tf.findBackendFactory(backendName)
        tf.removeBackend(backendName)
        tf.registerBackend(backendName, backendFactory)
      }

      await tf.setBackend(backendName)
    }

    async function initDetector() {
      switch (settings.model) {
        case poseDetection.SupportedModels.BlazePose:
          const runtime = settings.runtime.split('-')[0]
          if (runtime === 'mediapipe') {
            return poseDetection.createDetector(settings.model, {
              runtime,
              modelType:
                settings.modelVariant as poseDetection.BlazePoseModelType,
              solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}`,
            })
          } else if (runtime === 'tfjs') {
            return poseDetection.createDetector(settings.model, {
              runtime,
              modelType:
                settings.modelVariant as poseDetection.BlazePoseModelType,
            })
          }
        case poseDetection.SupportedModels.MoveNet:
          let modelType
          if (settings.modelVariant == 'lightning') {
            modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
          } else if (settings.modelVariant == 'thunder') {
            modelType = poseDetection.movenet.modelType.SINGLEPOSE_THUNDER
          } else if (settings.modelVariant == 'multipose') {
            modelType = poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING
          }
          const modelConfig = { modelType }

          return poseDetection.createDetector(settings.model, modelConfig)
      }
    }
    async function initialize() {
      setDetector(null)
      await tf.ready()
      const backend = settings.runtime.split('-')[1]
      await resetBackend(backend)
      const detector = await initDetector()
      setDetector(detector as poseDetection.PoseDetector)
    }
    initialize()
  }, [settings, toast])

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
            const newPoses = await detector.estimatePoses(video)
            setPoses(newPoses)
            drawPose(newPoses)
            updateFps() // Call updateFps after each successful pose detection
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
  }, [detector, drawPose, webcamRef, updateFps])

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
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <SettingsPopover onSettingsChange={handleSettingsChange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {isBrowserReady ? (
          <>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Camera View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {isLoading && <p>Loading camera...</p>}
                    {error && <p className="text-red-500">Error: {error}</p>}
                    <Webcam
                      ref={webcamRef}
                      mirrored
                      className="w-full"
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{
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
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
