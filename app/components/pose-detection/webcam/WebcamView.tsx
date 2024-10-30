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
import { Checkbox } from '@/app/components/ui/checkbox'
import { Label } from '@/app/components/ui/label'
import { Slider } from '@/app/components/ui/slider'
import { Switch } from '@/app/components/ui/switch'
import { useToast } from '@/app/hooks/use-toast'
import { drawPose } from '@/app/lib/poseDrawing'
import {
  calculateCombinedSimilarity,
  SimilarityStrategy,
} from '@/app/lib/simPose'

import { PoseLogEntry } from '../types'

interface WebcamViewProps {
  targetImageRef: RefObject<HTMLImageElement>
  targetCanvasRef: RefObject<HTMLCanvasElement>
  onSimilarityUpdate: (similarity: number) => void
  onLogEntry: (entry: PoseLogEntry) => void
}

export function WebcamView({
  targetImageRef,
  targetCanvasRef,
  onSimilarityUpdate,
  onLogEntry,
}: WebcamViewProps) {
  const { toast } = useToast()

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
  const lastLogTime = useRef<number>(0)
  const [isDetecting, setIsDetecting] = useState(false)
  const [selectedAngles, setSelectedAngles] = useState<string[]>([
    'leftElbowAngle',
    'leftShoulderAngle',
    'leftHipAngle',
    'leftKneeAngle',
    'rightElbowAngle',
    'rightShoulderAngle',
    'rightHipAngle',
    'rightKneeAngle',
  ])

  const [weights, setWeights] = useState({
    [SimilarityStrategy.KEY_ANGLES]: 0,
    [SimilarityStrategy.RELATIVE_ANGLES]: 1,
    [SimilarityStrategy.INVARIANT_FEATURES]: 0,
  })
  const [isModelLoading, setIsModelLoading] = useState(true)

  const [smoothedSimilarity, setSmoothedSimilarity] = useState<number>(0)
  const similarityBuffer = useRef<number[]>([])
  const BUFFER_SIZE = 5 // 平滑窗口大小
  const SIMILARITY_THRESHOLD = 0.1 // 最小变化阈值
  const FRAME_INTERVAL = 3 // 每隔几帧计算一次
  const frameCounter = useRef(0)

  // 平滑函数
  const smoothSimilarity = useCallback(
    (newValue: number) => {
      similarityBuffer.current.push(newValue)
      if (similarityBuffer.current.length > BUFFER_SIZE) {
        similarityBuffer.current.shift()
      }

      const average =
        similarityBuffer.current.reduce((a, b) => a + b, 0) /
        similarityBuffer.current.length

      // 只有变化超过阈值才更新
      if (Math.abs(average - smoothedSimilarity) > SIMILARITY_THRESHOLD) {
        setSmoothedSimilarity(average)
        return average
      }
      return smoothedSimilarity
    },
    [smoothedSimilarity]
  )

  const resetWeights = () => {
    setWeights({
      [SimilarityStrategy.KEY_ANGLES]: 0,
      [SimilarityStrategy.RELATIVE_ANGLES]: 1,
      [SimilarityStrategy.INVARIANT_FEATURES]: 0,
    })
  }

  useEffect(() => {
    const totalWeight = Object.values(weights).reduce(
      (sum, weight) => sum + weight,
      0
    )
    if (totalWeight > 1) {
      toast({
        title: 'Invalid Weights',
        description:
          'The sum of all weights cannot exceed 1. Weights have been reset.',
        variant: 'destructive',
      })
      resetWeights()
    }
  }, [weights, toast])

  useEffect(() => {
    lastFpsUpdateTime.current = performance.now()
  }, [])

  const drawPoseOnCanvas = useCallback((poses: poseDetection.Pose[]) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

    drawPose(ctx, poses, video.videoWidth, video.videoHeight, false, false)
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
      setIsModelLoading(true) // 开始加载
      try {
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
      } catch (error) {
        console.error('Error initializing detector:', error)
        setError('Failed to initialize pose detector')
      } finally {
        setIsModelLoading(false) // 结束加载
      }
    }
    initDetector()
  }, [])

  const logPoseIfNeeded = useCallback(
    async (pose: poseDetection.Pose, similarity: number) => {
      const now = Date.now()
      if (similarity > 0.5 && now - lastLogTime.current >= 2000) {
        if (!webcamRef.current) return ''
        const screenshot = webcamRef.current.getScreenshot() || ''
        const logEntry: PoseLogEntry = {
          id: crypto.randomUUID(),
          timestamp: now,
          screenshot,
          pose,
          similarity,
        }

        onLogEntry(logEntry)
        lastLogTime.current = now
      }
    },
    [onLogEntry]
  )
  const formatStrategyName = (strategy: string): string => {
    switch (strategy) {
      case SimilarityStrategy.KEY_ANGLES:
        return 'Key Angles'
      case SimilarityStrategy.RELATIVE_ANGLES:
        return 'Relative Angles'
      case SimilarityStrategy.INVARIANT_FEATURES:
        return 'Invariant Features'
      default:
        return strategy
    }
  }
  const calculateSimilarity = useCallback(
    (pose: poseDetection.Pose) => {
      // 控制计算频率
      frameCounter.current += 1
      if (frameCounter.current % FRAME_INTERVAL !== 0) return

      if (targetPose) {
        const similarity = calculateCombinedSimilarity(pose, targetPose, {
          strategies: [
            {
              strategy: SimilarityStrategy.KEY_ANGLES,
              weight: weights[SimilarityStrategy.KEY_ANGLES],
              selectedAngles: selectedAngles,
            },
            {
              strategy: SimilarityStrategy.RELATIVE_ANGLES,
              weight: weights[SimilarityStrategy.RELATIVE_ANGLES],
            },
            {
              strategy: SimilarityStrategy.INVARIANT_FEATURES,
              weight: weights[SimilarityStrategy.INVARIANT_FEATURES],
            },
          ],
          normalize: false,
        })

        if (typeof similarity === 'number') {
          const smoothed = smoothSimilarity(similarity)
          onSimilarityUpdate(smoothed)
          logPoseIfNeeded(pose, smoothed)
        }
      }
    },
    [
      targetPose,
      onSimilarityUpdate,
      logPoseIfNeeded,
      selectedAngles,
      weights,
      smoothSimilarity,
    ]
  )

  useEffect(() => {
    if (!detector || !webcamRef.current || !isDetecting) return

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
            const poses = await detector.estimatePoses(video, {
              flipHorizontal: false,
            })
            updateFps()
            if (poses.length > 0) {
              calculateSimilarity(poses[0])
              drawPoseOnCanvas(poses)
            }
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
  }, [detector, drawPoseOnCanvas, updateFps, calculateSimilarity, isDetecting])

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
          const poses = await detector.estimatePoses(targetImageRef.current, {
            flipHorizontal: false,
          })

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

    drawPose(
      ctx,
      [targetPose],
      targetImage.width,
      targetImage.height,
      true,
      false
    )
  }, [targetPose, targetCanvasRef, targetImageRef])

  useEffect(() => {
    if (targetPose) {
      drawTargetPoseOnCanvas()
    }
  }, [targetPose, drawTargetPoseOnCanvas])

  return (
    <Card className="flex flex-col">
      {isModelLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>Loading pose detection model...</p>
          </div>
        </div>
      )}
      <CardHeader className="flex-shrink-0">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Webcam View</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch
                id="pose-detection"
                checked={isDetecting}
                onCheckedChange={setIsDetecting}
              />
              <Label htmlFor="pose-detection">Detection</Label>
            </div>
          </div>

          {/* 添加权重控制滑块 */}
          <div className="space-y-4">
            {Object.entries(weights).map(([strategy, weight]) => (
              <div key={strategy} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>{formatStrategyName(strategy)}</Label>
                  <span className="text-sm">{weight.toFixed(1)}</span>
                </div>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[weight]}
                  onValueChange={(value) => {
                    setWeights((prev) => ({
                      ...prev,
                      [strategy]: value[0],
                    }))
                  }}
                />
              </div>
            ))}
          </div>

          {/* 只在 KEY_ANGLES 权重大于 0 时显示关键点选择 */}
          {weights[SimilarityStrategy.KEY_ANGLES] > 0 && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { id: 'leftElbowAngle', label: 'Left Elbow' },
                { id: 'leftShoulderAngle', label: 'Left Shoulder' },
                { id: 'leftHipAngle', label: 'Left Hip' },
                { id: 'leftKneeAngle', label: 'Left Knee' },
                { id: 'rightElbowAngle', label: 'Right Elbow' },
                { id: 'rightShoulderAngle', label: 'Right Shoulder' },
                { id: 'rightHipAngle', label: 'Right Hip' },
                { id: 'rightKneeAngle', label: 'Right Knee' },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={selectedAngles.includes(id)}
                    onCheckedChange={(checked) => {
                      setSelectedAngles((prev) =>
                        checked
                          ? [...prev, id]
                          : prev.filter((angle) => angle !== id)
                      )
                    }}
                  />
                  <Label htmlFor={id}>{label}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-row p-2 overflow-hidden">
        <div className="flex-1 relative">
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
