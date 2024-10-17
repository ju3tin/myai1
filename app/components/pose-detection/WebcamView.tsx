'use client'

import { useRef, useEffect } from 'react'

import Webcam from 'react-webcam'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export function WebcamView() {
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    // Here you can add pose detection logic
  }, [])

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Webcam View</h2>
      <div className="flex-1 bg-gray-200">
        <Card className="h-[calc(50vh-2rem)]">
          <CardHeader>
            <CardTitle>Webcam View</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
            <Webcam
              ref={webcamRef}
              mirrored
              className="w-full h-full object-contain"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
