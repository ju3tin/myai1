'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as poseDetection from '@tensorflow-models/pose-detection'
import Image from 'next/image'
import Webcam from 'react-webcam'

import { Button } from '@/app/components/ui/button'
import { Slider } from '@/app/components/ui/slider'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { drawPose as dp } from '@/app/lib/poseDrawing'
import {
  countValidSquats,
  detectSquatWithRef,
  SquatPhase,
  SquatLog,
  Feedback,
} from '@/app/lib/squatDetection'
import { useMN } from '@/app/contexts/mn-context'

const STANDARD_POSES = [
  { id: 1, src: '/poses/squat-1.jpg', label: '深蹲姿势 1' },
  { id: 2, src: '/poses/squat-2.jpg', label: '深蹲姿势 2' },
  { id: 3, src: '/poses/squat-3.jpg', label: '深蹲姿势 3' },
]

export default function SquatDetector() {
  const { detector, isLoading, error } = useMN()
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fps, setFps] = useState<number>(0)
  const [squatCount, setSquatCount] = useState<number>(0)
  const [feedback, setFeedback] = useState<Feedback>({
    isCorrect: true,
    message: 'Start squatting!',
  })
  const squatPhase = useRef<SquatPhase>(SquatPhase.STANDING)
  const [squatLogs, setSquatLogs] = useState<SquatLog[]>([])

  const frameCount = useRef<number>(0)
  const lastFpsUpdateTime = useRef<number>(performance.now())

  const [selectedPose, setSelectedPose] = useState<number | null>(
    STANDARD_POSES[0].id
  )
  const [poseKeypoints, setPoseKeypoints] = useState<poseDetection.Pose | null>(
    null
  )
  const standardImageRef = useRef<HTMLImageElement>(null)
  const standardCanvasRef = useRef<HTMLCanvasElement>(null)

  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.85)

  const handleThresholdChange = useCallback((value: number[]) => {
    setSimilarityThreshold(value[0])
  }, [])

  const captureScreenshot = useCallback(() => {
    if (!webcamRef.current) return ''
    return webcamRef.current.getScreenshot()
  }, [])

  useEffect(() => {
    console.log('detectSquat', squatLogs)
    // Update squat count based on sequence validation
    const newCount = countValidSquats(squatLogs)
    setSquatCount(newCount)
    console.log('newCount', newCount)
  }, [squatLogs])

  const addSquatLog = useCallback(
    (phase: SquatPhase) => {
      const screenshot = captureScreenshot()
      if (!screenshot) return

      setSquatLogs((prev) => [
        ...prev,
        {
          phase,
          timestamp: Date.now(),
          imageData: screenshot,
          isValid: false, // Initially set as invalid
        },
      ])
    },
    [captureScreenshot]
  )

  const drawPose = useCallback((pose: poseDetection.Pose) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

    // 绘制姿势
    dp(ctx, [pose], video.videoWidth, video.videoHeight)
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

  const detectSquatCallback = useCallback(
    (pose: poseDetection.Pose) => {
      if (!poseKeypoints) return // Ensure poseKeypoints is not null

      detectSquatWithRef({
        pose,
        squatPhase,
        setFeedback,
        onPhaseComplete: addSquatLog,
        referenceSquatPose: poseKeypoints,
        similarityThreshold: similarityThreshold,
      })
    },
    [setFeedback, addSquatLog, poseKeypoints, similarityThreshold]
  )

  const [activeTab, setActiveTab] = useState<string>('standardPose')

  useEffect(() => {
    if (!detector || !webcamRef.current || activeTab !== 'webcam') return

    let animationFrameId: number

    async function detectPose() {
      if (webcamRef.current?.video?.readyState === 4) {
        const poses = await detector!.estimatePoses(webcamRef.current.video, {
          flipHorizontal: false,
        })
        if (poses.length > 0) {
          drawPose(poses[0])
          detectSquatCallback(poses[0])
        }
        updateFps()
      }
      animationFrameId = requestAnimationFrame(detectPose)
    }

    detectPose()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [detector, drawPose, updateFps, detectSquatCallback, activeTab])

  const detectImagePose = useCallback(async () => {
    if (!detector || !standardImageRef.current) return

    const poses = await detector.estimatePoses(standardImageRef.current, {
      flipHorizontal: false,
    })

    if (poses.length > 0) {
      setPoseKeypoints(poses[0])
      const ctx = standardCanvasRef.current?.getContext('2d')
      if (ctx && standardImageRef.current) {
        dp(
          ctx,
          [poses[0]],
          standardImageRef.current.width,
          standardImageRef.current.height
        )
      }
    }
  }, [detector])

  const handlePoseSelect = useCallback(
    (poseId: number) => {
      setSelectedPose(poseId === selectedPose ? null : poseId)
    },
    [selectedPose]
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">正在加载姿势检测模型...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <p>模型加载失败: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 p-2">
        {STANDARD_POSES.map((pose) => (
          <Button
            key={pose.id}
            variant={selectedPose === pose.id ? 'default' : 'outline'}
            onClick={() => handlePoseSelect(pose.id)}
            className="flex-shrink-0"
          >
            <span className="ml-2">{pose.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            姿势相似度阈值: {similarityThreshold.toFixed(2)}
          </label>
          <span className="text-xs text-gray-500">值越高要求越严格</span>
        </div>
        <Slider
          defaultValue={[0.85]}
          max={1}
          min={0}
          step={0.01}
          value={[similarityThreshold]}
          onValueChange={handleThresholdChange}
          className="w-full"
        />
      </div>

      {selectedPose && (
        <Tabs
          defaultValue="standardPose"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList>
            <TabsTrigger value="standardPose">标准姿势</TabsTrigger>
            <TabsTrigger value="webcam">摄像头</TabsTrigger>
          </TabsList>
          <TabsContent value="standardPose">
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                <div className="relative">
                  <Image
                    ref={standardImageRef}
                    src={
                      STANDARD_POSES.find((p) => p.id === selectedPose)?.src ||
                      ''
                    }
                    alt="Standard Pose"
                    width={1024}
                    height={768}
                    className="w-full h-auto"
                    onLoad={detectImagePose}
                  />
                  <canvas
                    ref={standardCanvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="webcam">
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
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
                Squats: {squatCount}
              </div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded">
                {feedback.message}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">深蹲记录</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {squatLogs.slice(0, 3).map((log) => (
              <div
                key={log.timestamp}
                className={`flex flex-col items-center ${
                  log.isValid ? 'border-2 border-green-500' : ''
                }`}
              >
                <Image
                  src={log.imageData}
                  alt={`${SquatPhase[log.phase]} - 第1组`}
                  width={500}
                  height={300}
                  className="w-full h-auto rounded"
                />
                <span className="mt-2 text-sm">
                  {SquatPhase[log.phase]} - 第1组
                  {log.isValid && ' ✓'}
                </span>
              </div>
            ))}
          </div>

          {Array.from({ length: Math.ceil((squatLogs.length - 3) / 2) }).map(
            (_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-2 gap-4">
                {squatLogs
                  .slice(3 + rowIndex * 2, 5 + rowIndex * 2)
                  .map((log) => (
                    <div
                      key={log.timestamp}
                      className={`flex flex-col items-center ${
                        log.isValid ? 'border-2 border-green-500' : ''
                      }`}
                    >
                      <Image
                        src={log.imageData}
                        alt={`${SquatPhase[log.phase]} - 第${rowIndex + 2}组`}
                        width={500}
                        height={300}
                        className="w-full h-auto rounded"
                      />
                      <span className="mt-2 text-sm">
                        {SquatPhase[log.phase]} - 第{rowIndex + 2}组
                        {log.isValid && ' ✓'}
                      </span>
                    </div>
                  ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
