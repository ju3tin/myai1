'use client'

import { useCallback } from 'react'

import { PoseLandmarker } from '@mediapipe/tasks-vision'

import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { calculateAngle, calculateHeightDifference } from '@/app/lib/pose-utils'
import type { PoseCheckConfig } from '@/app/types/pose-training'
import { POSE_JOINTS } from '@/app/types/pose-training'

interface PoseCheckCardProps {
  check: PoseCheckConfig
  onUpdate: (updated: PoseCheckConfig) => void
  onDelete: () => void
  poseLandmarker: PoseLandmarker | null
  standardImage: string
}

export function PoseCheckCard({
  check,
  onUpdate,
  onDelete,
  poseLandmarker,
  standardImage,
}: PoseCheckCardProps) {
  const handleCalculateStandardValue = useCallback(async () => {
    if (!poseLandmarker || !standardImage) return

    const img = new Image()
    img.src = standardImage
    await img.decode()
    await poseLandmarker.setOptions({ runningMode: 'IMAGE' })
    const result = await poseLandmarker.detect(img)
    if (!result.landmarks?.[0]) return

    let standardValue: number | undefined

    if (check.type === 'angle' && check.joints) {
      standardValue = calculateAngle(
        result.landmarks[0][
          POSE_JOINTS.findIndex((j) => j.name === check.joints![0])
        ],
        result.landmarks[0][
          POSE_JOINTS.findIndex((j) => j.name === check.joints![1])
        ],
        result.landmarks[0][
          POSE_JOINTS.findIndex((j) => j.name === check.joints![2])
        ]
      )
    } else if (check.type === 'height' && check.points) {
      standardValue = calculateHeightDifference(
        result.landmarks[0][
          POSE_JOINTS.findIndex((j) => j.name === check.points![0])
        ],
        result.landmarks[0][
          POSE_JOINTS.findIndex((j) => j.name === check.points![1])
        ]
      )
    }

    if (standardValue !== undefined) {
      onUpdate({
        ...check,
        standardValue: Math.round(standardValue * 100) / 100,
      })
    }
  }, [check, onUpdate, poseLandmarker, standardImage])

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {check.type.charAt(0).toUpperCase() + check.type.slice(1)} Check
          </h3>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>

        {check.type === 'angle' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Select
                value={check.joints?.[0]}
                onValueChange={(value) =>
                  onUpdate({
                    ...check,
                    joints: [
                      value,
                      check.joints?.[1] || '',
                      check.joints?.[2] || '',
                    ],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="First joint" />
                </SelectTrigger>
                <SelectContent>
                  {POSE_JOINTS.map((joint) => (
                    <SelectItem key={joint.name} value={joint.name}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={check.joints?.[1]}
                onValueChange={(value) =>
                  onUpdate({
                    ...check,
                    joints: [
                      check.joints?.[0] || '',
                      value,
                      check.joints?.[2] || '',
                    ],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Middle joint" />
                </SelectTrigger>
                <SelectContent>
                  {POSE_JOINTS.map((joint) => (
                    <SelectItem key={joint.name} value={joint.name}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={check.joints?.[2]}
                onValueChange={(value) =>
                  onUpdate({
                    ...check,
                    joints: [
                      check.joints?.[0] || '',
                      check.joints?.[1] || '',
                      value,
                    ],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Last joint" />
                </SelectTrigger>
                <SelectContent>
                  {POSE_JOINTS.map((joint) => (
                    <SelectItem key={joint.name} value={joint.name}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={check.comparison}
                onValueChange={(value: 'greater' | 'less' | 'equal') =>
                  onUpdate({ ...check, comparison: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Comparison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Greater than</SelectItem>
                  <SelectItem value="less">Less than</SelectItem>
                  <SelectItem value="equal">Equal to</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={check.targetValue}
                onChange={(e) =>
                  onUpdate({ ...check, targetValue: Number(e.target.value) })
                }
                placeholder="Target angle"
                className="w-24"
              />

              <Button onClick={handleCalculateStandardValue}>
                Calculate Standard
              </Button>
            </div>

            {check.standardValue !== undefined && (
              <p className="text-sm text-gray-600">
                Standard angle: {check.standardValue}°
              </p>
            )}
          </div>
        )}

        {check.type === 'height' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={check.points?.[0]}
                onValueChange={(value) =>
                  onUpdate({
                    ...check,
                    points: [value, check.points?.[1] || ''],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="First point" />
                </SelectTrigger>
                <SelectContent>
                  {POSE_JOINTS.map((joint) => (
                    <SelectItem key={joint.name} value={joint.name}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={check.points?.[1]}
                onValueChange={(value) =>
                  onUpdate({
                    ...check,
                    points: [check.points?.[0] || '', value],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Second point" />
                </SelectTrigger>
                <SelectContent>
                  {POSE_JOINTS.map((joint) => (
                    <SelectItem key={joint.name} value={joint.name}>
                      {joint.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={check.tolerance}
                onChange={(e) =>
                  onUpdate({ ...check, tolerance: Number(e.target.value) })
                }
                placeholder="Height tolerance"
                className="w-24"
              />

              <Button onClick={handleCalculateStandardValue}>
                Calculate Standard
              </Button>
            </div>

            {check.standardValue !== undefined && (
              <p className="text-sm text-gray-600">
                Standard height difference: {check.standardValue}
              </p>
            )}
          </div>
        )}

        {check.type === 'duration' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Min Duration (s)</label>
              <Input
                type="number"
                value={check.durationRange?.min}
                onChange={(e) =>
                  onUpdate({
                    ...check,
                    durationRange: {
                      min: Number(e.target.value),
                      max: check.durationRange?.max || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm">Max Duration (s)</label>
              <Input
                type="number"
                value={check.durationRange?.max}
                onChange={(e) =>
                  onUpdate({
                    ...check,
                    durationRange: {
                      min: check.durationRange?.min || 0,
                      max: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        )}

        {check.type === 'count' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Min Count</label>
              <Input
                type="number"
                value={check.countRange?.min}
                onChange={(e) =>
                  onUpdate({
                    ...check,
                    countRange: {
                      min: Number(e.target.value),
                      max: check.countRange?.max || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm">Max Count</label>
              <Input
                type="number"
                value={check.countRange?.max}
                onChange={(e) =>
                  onUpdate({
                    ...check,
                    countRange: {
                      min: check.countRange?.min || 0,
                      max: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
