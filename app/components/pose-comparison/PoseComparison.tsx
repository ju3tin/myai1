'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  DrawingUtils,
  NormalizedLandmark,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

import { Button } from '@/app/components/ui/button'
import { useMPPoseDetector } from '@/app/contexts/MPPoseDetectorContext'
import {
  calculatePoseSimilarity,
  extractKeyAngles,
} from '@/app/lib/poseComparison'

interface NamedLandmark extends NormalizedLandmark {
  name: string
}

const LANDMARK_NAMES: { [key: number]: string } = {
  0: 'nose',
  1: 'left eye (inner)',
  2: 'left eye',
  3: 'left eye (outer)',
  4: 'right eye (inner)',
  5: 'right eye',
  6: 'right eye (outer)',
  7: 'left ear',
  8: 'right ear',
  9: 'mouth (left)',
  10: 'mouth (right)',
  11: 'left shoulder',
  12: 'right shoulder',
  13: 'left elbow',
  14: 'right elbow',
  15: 'left wrist',
  16: 'right wrist',
  17: 'left pinky',
  18: 'right pinky',
  19: 'left index',
  20: 'right index',
  21: 'left thumb',
  22: 'right thumb',
  23: 'left hip',
  24: 'right hip',
  25: 'left knee',
  26: 'right knee',
  27: 'left ankle',
  28: 'right ankle',
  29: 'left heel',
  30: 'right heel',
  31: 'left foot index',
  32: 'right foot index',
}

export function PoseComparison() {
  const { poseLandmarker, isLoading } = useMPPoseDetector()
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [landmarks1, setLandmarks1] = useState<NamedLandmark[] | null>(null)
  const [landmarks2, setLandmarks2] = useState<NamedLandmark[] | null>(null)
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

      img.onload = async () => {
        if (imageNumber === 1) setImage1(imageUrl)
        else setImage2(imageUrl)

        await poseLandmarker.setOptions({ runningMode: 'IMAGE' })
        const detections = await poseLandmarker.detect(img)
        const landmarks = detections.worldLandmarks[0]
        console.log(landmarks)
        if (!landmarks) {
          console.warn('No landmarks detected')
          return
        }

        const landmarksWithNames = landmarks.map((landmark, index) => ({
          ...landmark,
          name: LANDMARK_NAMES[index] || `unknown-${index}`,
        }))

        if (imageNumber === 1) setLandmarks1(landmarksWithNames)
        else setLandmarks2(landmarksWithNames)

        const canvas =
          imageNumber === 1 ? canvasRef1.current : canvasRef2.current
        if (!canvas) {
          console.warn('No canvas found')
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        console.log(canvas.width, canvas.height)
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Create drawing utils
        const drawingUtils = new DrawingUtils(ctx)

        // Draw pose connections (skeleton lines)
        drawingUtils.drawConnectors(
          detections.landmarks[0],
          PoseLandmarker.POSE_CONNECTIONS,
          {
            color: 'rgba(0, 255, 0, 0.7)', // Semi-transparent green
            lineWidth: 3,
          }
        )

        // Draw landmarks (joints)
        drawingUtils.drawLandmarks(detections.landmarks[0], {
          color: 'rgba(255, 0, 0, 0.7)', // Semi-transparent red
          lineWidth: 2,
          radius: 5,
        })
      }

      img.onerror = (error) => {
        console.error('Error loading image:', error)
      }
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

        <div className="space-y-4">
          <canvas ref={canvasRef1} className="w-full" />
          {image1 && (
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(landmarks1, null, 2)}
            </pre>
          )}
        </div>
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

        <div className="space-y-4">
          <canvas ref={canvasRef2} className="w-full" />
          {image2 && (
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(landmarks2, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
