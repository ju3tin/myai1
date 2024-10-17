'use client'

import { useRef, useState, useEffect } from 'react'

import Webcam from 'react-webcam'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Slider } from '@/app/components/ui/slider'

export function WebcamView() {
  const webcamRef = useRef<Webcam>(null)
  const [zoom, setZoom] = useState(100)
  const [verticalOffset, setVerticalOffset] = useState(0)

  useEffect(() => {
    // Here you can add pose detection logic
  }, [])

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  const handleOffsetChange = (value: number[]) => {
    setVerticalOffset(value[0])
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Webcam View</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative flex-grow overflow-hidden">
          <Webcam
            ref={webcamRef}
            mirrored
            style={{
              width: `${zoom}%`,
              height: `${zoom}%`,
              objectFit: 'cover',
              objectPosition: `center ${verticalOffset}%`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-20">Zoom:</span>
            <Slider
              min={100}
              max={200}
              step={1}
              value={[zoom]}
              onValueChange={handleZoomChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-20">Vertical:</span>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={[verticalOffset]}
              onValueChange={handleOffsetChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
