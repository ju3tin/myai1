'use client'

import { useState, useEffect } from 'react'

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

interface DataPoint {
  time: number
  similarity: number
}

export function SimilarityChart() {
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    // Simulating real-time data updates
    const interval = setInterval(() => {
      setData((currentData) => {
        const newData = [
          ...currentData,
          { time: Date.now(), similarity: Math.random() },
        ]
        return newData.slice(-500) // Keep only the last 500 data points
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Similarity Chart</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" type="number" domain={['auto', 'auto']} />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="similarity"
              stroke="#8884d8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
