'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import * as poseDetection from '@tensorflow-models/pose-detection'

import { Button } from '@/app/components/ui/button'
import { usePoseDetector } from '@/app/contexts/PoseDetectorContext'
import { drawPose } from '@/app/lib/poseDrawing'
import {
  calculateCombinedSimilarity,
  SimilarityStrategy,
} from '@/app/lib/simPose'

export function TMPoseComparison() {
  const { detector, isLoading, error } = usePoseDetector()
  const [image1, setImage1] = useState<string | null>(null)
  const [image2, setImage2] = useState<string | null>(null)
  const [imageURL1, setImageURL1] = useState<string | null>(null)
  const [imageURL2, setImageURL2] = useState<string | null>(null)
  const [pose1, setPose1] = useState<poseDetection.Pose | null>(null)
  const [pose2, setPose2] = useState<poseDetection.Pose | null>(null)
  const [similarity, setSimilarity] = useState<number | null>(null)

  const canvasRef1 = useRef<HTMLCanvasElement>(null)
  const canvasRef2 = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
      const file = e.target.files?.[0]
      if (!file || !detector) return

      const imageUrl = URL.createObjectURL(file)
      const img = new Image()
      img.src = imageUrl

      if (imageNumber === 1) setImageURL1(imageUrl)
      else setImageURL2(imageUrl)

      img.onload = async () => {
        if (imageNumber === 1) setImage1(imageUrl)
        else setImage2(imageUrl)

        const detections = await detector.estimatePoses(img)
        console.log(detections)
        if (!detections || detections.length === 0) {
          console.warn('No landmarks detected')
          return
        }

        if (imageNumber === 1) setPose1(detections[0])
        else setPose2(detections[0])

        const canvas =
          imageNumber === 1 ? canvasRef1.current : canvasRef2.current
        if (!canvas) {
          console.warn('No canvas found')
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        drawPose(ctx, detections, img.width, img.height, true)
      }

      img.onerror = (error) => {
        console.error('Error loading image:', error)
      }
    },
    [detector]
  )

  useEffect(() => {
    if (pose1 && pose2) {
      setSimilarity(
        calculateCombinedSimilarity(pose1, pose2, {
          strategies: [
            {
              strategy: SimilarityStrategy.KEY_ANGLES,
              weight: 1,
              selectedAngles: [
                'leftElbowAngle',
                'leftShoulderAngle',
                'leftHipAngle',
                'leftKneeAngle',
                'rightElbowAngle',
                'rightShoulderAngle',
                'rightHipAngle',
                'rightKneeAngle',
              ], // 根据需要选择关键角度
            },
            { strategy: SimilarityStrategy.RELATIVE_ANGLES, weight: 0 },
            { strategy: SimilarityStrategy.INVARIANT_FEATURES, weight: 0 },
          ],
        })
      )
    }
  }, [pose1, pose2])

  if (isLoading) return <div>Loading pose detector...</div>
  if (error) return <div>Error loading pose detector: {error}</div>

  return (
    <div className="grid grid-cols-2 gap-8">
      {similarity !== null && (
        <div className="col-span-2 bg-blue-100 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold">Pose Similarity Score</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {similarity * 100}%
          </p>
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

        <div className="relative  ">
          {imageURL1 && (
            <img src={imageURL1 ?? ''} alt="Image 1" className="w-full" />
          )}
          <canvas ref={canvasRef1} className="absolute top-0 left-0 w-full" />
          {image1 && (
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(pose1, null, 2)}
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

        <div className="relative">
          {imageURL2 && (
            <img src={imageURL2 ?? ''} alt="Image 2" className="w-full" />
          )}
          <canvas ref={canvasRef2} className="absolute top-0 left-0 w-full" />
          {image2 && (
            <pre className="text-sm bg-gray-100 p-4 rounded">
              {JSON.stringify(pose2, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
