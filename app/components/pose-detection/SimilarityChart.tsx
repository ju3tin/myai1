'use client'

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

interface SimilarityChartProps {
  data: DataPoint[]
}

export function SimilarityChart({ data }: SimilarityChartProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Similarity Chart</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
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
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
