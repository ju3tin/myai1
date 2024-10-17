import { RefObject, useState, useEffect } from 'react'

import Image from 'next/image'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

interface TargetImageProps {
  targetImageRef: RefObject<HTMLImageElement>
  targetCanvasRef: RefObject<HTMLCanvasElement>
}

export function TargetImage({
  targetImageRef,
  targetCanvasRef,
}: TargetImageProps) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateDimensions = () => {
      if (targetImageRef.current) {
        setImageDimensions({
          width: targetImageRef.current.width,
          height: targetImageRef.current.height,
        })
      }
    }

    // Update dimensions when the image loads
    if (targetImageRef.current) {
      targetImageRef.current.onload = updateDimensions
    }

    // Initial update
    updateDimensions()

    // Update dimensions on window resize
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [targetImageRef])

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Target Pose</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
        <div className="relative">
          <Image
            ref={targetImageRef}
            src="/placeholder-pose.jpg"
            alt="Target pose"
            width={500}
            height={500}
            className="w-full h-full object-contain"
          />
          <canvas
            ref={targetCanvasRef}
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
