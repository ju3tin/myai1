'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

import * as tf from '@tensorflow/tfjs-core'
import * as poseDetection from '@tensorflow-models/pose-detection'
import Image from 'next/image'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-webgl'
import { drawPose as dp } from '@/app/lib/poseDrawing'
import {
  countValidSquats,
  detectSquat,
  SquatPhase,
  SquatLog,
  Feedback,
} from '@/app/lib/squatDetection'

export default function SquatDetector() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
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

  const drawPose = useCallback((pose: poseDetection.Pose) => {
    const ctx = canvasRef.current?.getContext('2d')
    const video = webcamRef.current?.video
    if (!ctx || !video) return

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
      detectSquat({
        pose,
        squatPhase,
        setFeedback,
        onPhaseComplete: addSquatLog,
      })
    },
    [setFeedback, addSquatLog]
  )

  useEffect(() => {
    if (!detector || !webcamRef.current) return

    let animationFrameId: number

    async function detectPose() {
      if (webcamRef.current && webcamRef.current.video) {
        const video = webcamRef.current.video
        if (detector && video.readyState === 4) {
          const poses = await detector.estimatePoses(video)
          if (poses.length > 0) {
            drawPose(poses[0])
            detectSquatCallback(poses[0])
          }
          updateFps()
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
  }, [detector, drawPose, updateFps, detectSquatCallback])

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
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded">
          Squats: {squatCount}
        </div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white p-2 rounded">
          {feedback.message}
        </div>
      </div>

      {/* Update Squat Log Display to show validity */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">深蹲记录</h2>
        <div className="flex flex-col gap-4">
          {/* First row - 3 images */}
          <div className="grid grid-cols-3 gap-4">
            {squatLogs.slice(0, 3).map((log, index) => (
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

          {/* Subsequent rows - 2 images each */}
          {Array.from({ length: Math.ceil((squatLogs.length - 3) / 2) }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-2 gap-4">
              {squatLogs.slice(3 + rowIndex * 2, 5 + rowIndex * 2).map((log) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
