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

import { LogView } from './LogView'
import { Settings } from './Settings'
import { TargetImage } from './TargetImage'
import { PoseLogEntry } from './types'
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
  const [similarityMethod, setSimilarityMethod] = useState('weightedDistance')
  const [coordinateSystem, setCoordinateSystem] = useState('default')
  const [logs, setLogs] = useState<PoseLogEntry[]>([])

  const handleSimilarityUpdate = useCallback((similarity: number) => {
    setSimilarityData((prevData) => {
      const newData = [...prevData, { time: Date.now(), similarity }]
      return newData.slice(-500) // Keep only the last 500 data points
    })
  }, [])

  const handleLogEntry = useCallback((entry: PoseLogEntry) => {
    setLogs((prevLogs) => [...prevLogs, entry])
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="w-full">
          <Settings
            similarityMethod={similarityMethod}
            setSimilarityMethod={setSimilarityMethod}
            coordinateSystem={coordinateSystem}
            setCoordinateSystem={setCoordinateSystem}
          />
        </div>
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Similarity Chart</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={similarityData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(unixTime) =>
                      new Date(unixTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                    interval="preserveStartEnd"
                  />
                  <YAxis domain={[0, 1]} />
                  <Tooltip
                    labelFormatter={(label) =>
                      new Date(label).toLocaleTimeString()
                    }
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

        <div className="flex space-x-4">
          <div className="w-1/2">
            <WebcamView
              targetImageRef={targetImageRef}
              targetCanvasRef={targetCanvasRef}
              onSimilarityUpdate={handleSimilarityUpdate}
              similarityMethod={similarityMethod}
              onLogEntry={handleLogEntry}
            />
          </div>
          <div className="w-1/2">
            <TargetImage
              targetImageRef={targetImageRef}
              targetCanvasRef={targetCanvasRef}
            />
          </div>
        </div>

        <div className="w-full">
          <LogView logs={logs} />
        </div>
      </div>
    </div>
  )
}
