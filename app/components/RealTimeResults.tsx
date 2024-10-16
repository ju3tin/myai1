import React, { memo } from 'react'

import * as poseDetection from '@tensorflow-models/pose-detection'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

interface RealTimeResultsProps {
  poses: poseDetection.Pose[]
}

export const RealTimeResults = memo(function RealTimeResults({
  poses,
}: RealTimeResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-time Results</CardTitle>
      </CardHeader>
      <CardContent>
        <pre>{JSON.stringify(poses, null, 2)}</pre>
      </CardContent>
    </Card>
  )
})
