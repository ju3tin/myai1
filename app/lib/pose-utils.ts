import type { NormalizedLandmark } from '@mediapipe/tasks-vision'

export function calculateAngle(
  point1: NormalizedLandmark,
  point2: NormalizedLandmark,
  point3: NormalizedLandmark
): number {
  const radians =
    Math.atan2(point3.y - point2.y, point3.x - point2.x) -
    Math.atan2(point1.y - point2.y, point1.x - point2.x)

  let angle = Math.abs((radians * 180.0) / Math.PI)

  if (angle > 180.0) angle = 360 - angle

  return angle
}

export function calculateHeightDifference(
  point1: NormalizedLandmark,
  point2: NormalizedLandmark
): number {
  return Math.abs(point1.y - point2.y)
}
