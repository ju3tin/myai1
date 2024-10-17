'use client'

import { useRef, useState, useCallback } from 'react'

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

import { Settings } from './Settings'
import { TargetImage } from './TargetImage'
import { WebcamView } from './WebcamView'

interface DataPoint {
  time: number
  similarity: number
}

const initialData: DataPoint[] = [
  { time: Date.now() - 2000, similarity: 0 },
  { time: Date.now() - 1000, similarity: 0 },
  { time: Date.now(), similarity: 0 },
]

export function PoseDetectionView() {
  const targetImageRef = useRef<HTMLImageElement>(null)
  const targetCanvasRef = useRef<HTMLCanvasElement>(null)
  const [similarityData, setSimilarityData] = useState<DataPoint[]>(initialData)

  const handleSimilarityUpdate = useCallback((similarity: number) => {
    setSimilarityData((prevData) => {
      const newData = [...prevData, { time: Date.now(), similarity }]
      return newData.slice(-500) // Keep only the last 500 data points
    })
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)]">
      <div className="flex-1 flex p-4 space-x-4">
        <div className="w-1/3 flex flex-col h-full min-h-full">
          <div className="mb-4">
            <Settings />
          </div>
          <div className="mb-4">
            <Card className="">
              <CardHeader>
                <CardTitle>Similarity Chart</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]"> {/* 设置固定高度 */}
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={similarityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <XAxis
          dataKey="time"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          interval="preserveStartEnd"
        />
        <YAxis domain={[0, 1]} />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleTimeString()}
          formatter={(value: number) => value.toFixed(4)}
        />
        <Line
          type="monotone"
          dataKey="similarity"
          stroke="#8884d8"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent>
            </Card>
          </div>
          <div className="">
            <WebcamView
              targetImageRef={targetImageRef}
              targetCanvasRef={targetCanvasRef}
              onSimilarityUpdate={handleSimilarityUpdate}
            />
          </div>
        </div>
        <div className="flex-1 relative h-full min-h-full">
          <TargetImage
            targetImageRef={targetImageRef}
            targetCanvasRef={targetCanvasRef}
          />
        </div>
      </div>
    </div>
  )
}
