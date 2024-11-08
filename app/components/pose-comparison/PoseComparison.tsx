'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { DrawingUtils, NormalizedLandmark, PoseLandmarker } from '@mediapipe/tasks-vision'

import { Button } from '@/app/components/ui/button'
import { useMPPoseDetector } from '@/app/contexts/MPPoseDetectorContext'
import {
  calculatePoseSimilarity,
  extractKeyAngles,
} from '@/app/lib/poseComparison'

export function PoseComparison() {
  const { poseLandmarker, isLoading } = useMPPoseDetector()
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [landmarks1, setLandmarks1] = useState<NormalizedLandmark[] | null>(
    null
  )
  const [landmarks2, setLandmarks2] = useState<NormalizedLandmark[] | null>(
    null
  )
  const [similarity, setSimilarity] = useState<number | null>(null)

  const canvasRef1 = useRef<HTMLCanvasElement>(null)
  const canvasRef2 = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
      const file = e.target.files?.[0]
      if (!file || !poseLandmarker) return

      const imageUrl = URL.createObjectURL(file)
      const img = new Image()
      img.src = imageUrl

      await img.decode()
      if (imageNumber === 1) setImage1(imageUrl)
      else setImage2(imageUrl)
      await poseLandmarker.setOptions({ runningMode: 'IMAGE' })
      const detections = await poseLandmarker.detect(img)
      const landmarks = detections.landmarks[0]

      if (imageNumber === 1) setLandmarks1(landmarks)
      else setLandmarks2(landmarks)

      const canvas = imageNumber === 1 ? canvasRef1.current : canvasRef2.current
      if (!canvas) return

      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const drawingUtils = new DrawingUtils(ctx)
      drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2,
      })
      drawingUtils.drawLandmarks(landmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3,
      })
    },
    [poseLandmarker]
  )

  useEffect(() => {
    if (landmarks1 && landmarks2) {
      const angles1 = extractKeyAngles(landmarks1)
      const angles2 = extractKeyAngles(landmarks2)
      const similarityScore = calculatePoseSimilarity(angles1, angles2)
      setSimilarity(similarityScore)
    }
  }, [landmarks1, landmarks2])

  if (isLoading) return <div>Loading pose detector...</div>

  return (
    <div className="grid grid-cols-2 gap-8">
      {similarity !== null && (
        <div className="col-span-2 bg-blue-100 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">Pose Similarity Score</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{similarity}%</p>
        </div>
      )}
      <div className="space-y-4">
        <Button asChild>
          <label>
            Upload Image 1
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 1)}
            />
          </label>
        </Button>
        {image1 && (
          <div className="space-y-4">
            <canvas ref={canvasRef1} className="w-full" />
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(landmarks1, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button asChild>
          <label>
            Upload Image 2
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 2)}
            />
          </label>
        </Button>
        {image2 && (
          <div className="space-y-4">
            <canvas ref={canvasRef2} className="w-full" />
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(landmarks2, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
