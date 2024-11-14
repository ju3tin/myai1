'use client'

import { useMemo } from 'react'

import { Card } from '@/app/components/ui/card'
import { Progress } from '@/app/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import type { PoseCheckConfig, PracticeResult } from '@/app/types/pose-training'

interface PoseReportProps {
  practiceResults: PracticeResult[]
  poseChecks: PoseCheckConfig[]
}

export function PoseReport({ practiceResults, poseChecks }: PoseReportProps) {
  const summary = useMemo(() => {
    const checkResults = poseChecks
      .map((check) => {
        const result = practiceResults.find((r) => r.checkId === check.id)
        if (!result) return null

        let status: 'success' | 'warning' | 'error' = 'error'
        let message = ''
        let achievement = 0

        switch (check.type) {
          case 'angle': {
            if (check.targetValue === undefined) {
              achievement = 0
              status = 'error'
              message = 'No target value specified'
              break
            }

            const diff = Math.abs(result.value - check.targetValue)
            const tolerance = check.tolerance || 5
            achievement = Math.max(
              0,
              Math.min(100, 100 - (diff / tolerance) * 100)
            )

            if (diff <= tolerance) {
              status = 'success'
              message = 'Angle matched within tolerance'
            } else if (diff <= tolerance * 2) {
              status = 'warning'
              message = 'Angle slightly off target'
            } else {
              message = 'Angle significantly off target'
            }
            break
          }
          case 'height': {
            const diff = Math.abs(result.value - (check.standardValue || 0))
            const tolerance = check.tolerance || 0.1
            achievement = Math.max(
              0,
              Math.min(100, 100 - (diff / tolerance) * 100)
            )

            if (diff <= tolerance) {
              status = 'success'
              message = 'Height difference matched'
            } else if (diff <= tolerance * 2) {
              status = 'warning'
              message = 'Height difference slightly off'
            } else {
              message = 'Height difference too large'
            }
            break
          }
          case 'duration': {
            const duration = result.duration || 0
            const minDuration = check.durationRange?.min || 0
            const maxDuration = check.durationRange?.max || minDuration
            achievement = Math.min(100, (duration / minDuration) * 100)

            if (duration >= minDuration) {
              if (maxDuration && duration > maxDuration) {
                status = 'warning'
                message = 'Duration exceeded maximum'
              } else {
                status = 'success'
                message = 'Duration requirement met'
              }
            } else {
              message = 'Duration too short'
            }
            break
          }
          case 'count': {
            const count = result.count || 0
            const minCount = check.countRange?.min || 0
            const maxCount = check.countRange?.max || minCount
            achievement = Math.min(100, (count / minCount) * 100)

            if (count >= minCount) {
              if (maxCount && count > maxCount) {
                status = 'warning'
                message = 'Count exceeded maximum'
              } else {
                status = 'success'
                message = 'Count requirement met'
              }
            } else {
              message = 'Count too low'
            }
            break
          }
        }

        return {
          check,
          result,
          status,
          message,
          achievement,
        }
      })
      .filter(Boolean)

    const overallScore =
      checkResults.reduce((acc, curr) => acc + curr!.achievement, 0) /
      checkResults.length

    return {
      checkResults,
      overallScore,
    }
  }, [practiceResults, poseChecks])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Practice Summary</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Overall Score</span>
              <span className="font-medium">
                {summary.overallScore.toFixed(1)}%
              </span>
            </div>
            <Progress value={summary.overallScore} className="h-2" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Detailed Results</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Check Type</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Achieved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.checkResults.map((item) => (
              <TableRow key={item!.check.id}>
                <TableCell className="font-medium">
                  {item!.check.type.charAt(0).toUpperCase() +
                    item!.check.type.slice(1)}
                </TableCell>
                <TableCell>
                  {item!.check.type === 'angle' &&
                    `${item!.check.targetValue}° (±${item!.check.tolerance || 5}°)`}
                  {item!.check.type === 'height' &&
                    `${item!.check.standardValue?.toFixed(3)} (±${item!.check.tolerance})`}
                  {item!.check.type === 'duration' &&
                    `${item!.check.durationRange?.min}s - ${item!.check.durationRange?.max}s`}
                  {item!.check.type === 'count' &&
                    `${item!.check.countRange?.min} - ${item!.check.countRange?.max}`}
                </TableCell>
                <TableCell>
                  {item!.check.type === 'angle' &&
                    `${item!.result.value.toFixed(1)}°`}
                  {item!.check.type === 'height' &&
                    item!.result.value.toFixed(3)}
                  {item!.check.type === 'duration' &&
                    `${item!.result.duration?.toFixed(1)}s`}
                  {item!.check.type === 'count' && item!.result.count}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                      item!.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : item!.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item!.status}
                  </span>
                </TableCell>
                <TableCell>{item!.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
