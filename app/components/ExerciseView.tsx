'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Webcam from 'react-webcam'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import Image from 'next/image'
import { RealTimeResults } from './RealTimeResults'

// Memoized TargetPoseImage component
const TargetPoseImage = React.memo(function TargetPoseImage() {
  return (
    <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
      <Image
        src="/placeholder-pose.avif"
        alt="Target pose"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'contain' }}
        priority
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.classList.remove('hidden')
        }}
      />
      <p className="text-gray-500 hidden">No target pose image available</p>
    </div>
  )
})

export function ExerciseView() {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(
    null
  )
  const [poses, setPoses] = useState<poseDetection.Pose[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const drawPose = useCallback((poses: poseDetection.Pose[]) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx && poses.length > 0) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      poses[0].keypoints.forEach((keypoint) => {
        if (keypoint.score && keypoint.score > 0.3) {
          ctx.beginPath()
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
          ctx.fillStyle = 'red'
          ctx.fill()
        }
      })
    }
  }, [])

  useEffect(() => {
    async function initializeDetector() {
      await tf.ready()
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        runtime: 'tfjs-webgl',
      }
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      )
      setDetector(detector)
    }
    initializeDetector()
  }, [])

  useEffect(() => {
    if (detector) {
      const intervalId = setInterval(async () => {
        if (webcamRef.current && webcamRef.current.video) {
          const video = webcamRef.current.video
          if (
            video.readyState === 4 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {
            try {
              const newPoses = await detector.estimatePoses(video)
              setPoses(newPoses)
              drawPose(newPoses)
            } catch (error) {
              console.error('Error estimating poses:', error)
            }
          }
        }
      }, 100)
      return () => clearInterval(intervalId)
    }
  }, [detector, drawPose])

  useEffect(() => {
    if (webcamRef.current) {
      console.log('Webcam ref is set')
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  width: 720,
                  height: 480,
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
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Pose</CardTitle>
          </CardHeader>
          <CardContent>
            <TargetPoseImage />
          </CardContent>
        </Card>
      </div>
      <RealTimeResults poses={poses} />
    </div>
  )
}
