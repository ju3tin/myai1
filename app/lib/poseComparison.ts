import { NormalizedLandmark } from '@mediapipe/tasks-vision'

interface Angle {
  joint: string
  angle: number
}

function calculateAngle(
  point1: NormalizedLandmark,
  point2: NormalizedLandmark,
  point3: NormalizedLandmark
): number {
  // Check visibility of all points
  const visibilityThreshold = 0.3
  const isVisible =
    point1.visibility > visibilityThreshold &&
    point2.visibility > visibilityThreshold &&
    point3.visibility > visibilityThreshold

  // If any point is not sufficiently visible, return max angle (180)
  if (!isVisible) return 180

  const radians =
    Math.atan2(point3.y - point2.y, point3.x - point2.x) -
    Math.atan2(point1.y - point2.y, point1.x - point2.x)
  let angle = Math.abs((radians * 180.0) / Math.PI)

  if (angle > 180.0) angle = 360 - angle
  return angle
}

export function extractKeyAngles(landmarks: NormalizedLandmark[]): Angle[] {
  if (!landmarks || landmarks.length < 33) return []

  return [
    {
      joint: 'leftElbow',
      angle: calculateAngle(
        landmarks[11], // left shoulder
        landmarks[13], // left elbow
        landmarks[15] // left wrist
      ),
    },
    {
      joint: 'rightElbow',
      angle: calculateAngle(
        landmarks[12], // right shoulder
        landmarks[14], // right elbow
        landmarks[16] // right wrist
      ),
    },
    {
      joint: 'leftKnee',
      angle: calculateAngle(
        landmarks[23], // left hip
        landmarks[25], // left knee
        landmarks[27] // left ankle
      ),
    },
    {
      joint: 'rightKnee',
      angle: calculateAngle(
        landmarks[24], // right hip
        landmarks[26], // right knee
        landmarks[28] // right ankle
      ),
    },
    {
      joint: 'leftShoulder',
      angle: calculateAngle(
        landmarks[13], // left elbow
        landmarks[11], // left shoulder
        landmarks[23] // left hip
      ),
    },
    {
      joint: 'rightShoulder',
      angle: calculateAngle(
        landmarks[14], // right elbow
        landmarks[12], // right shoulder
        landmarks[24] // right hip
      ),
    },
    {
      joint: 'leftHip',
      angle: calculateAngle(
        landmarks[11], // left shoulder
        landmarks[23], // left hip
        landmarks[25] // left knee
      ),
    },
    {
      joint: 'rightHip',
      angle: calculateAngle(
        landmarks[12], // right shoulder
        landmarks[24], // right hip
        landmarks[26] // right knee
      ),
    },
  ]
}

export function calculatePoseSimilarity(
  angles1: Angle[],
  angles2: Angle[]
): number {
  if (!angles1.length || !angles2.length) return 0

  const maxDifference = 180 // Maximum possible angle difference
  let totalDifference = 0
  let comparedAngles = 0

  angles1.forEach((angle1) => {
    const angle2 = angles2.find((a) => a.joint === angle1.joint)
    if (angle2) {
      totalDifference += Math.abs(angle1.angle - angle2.angle)
      comparedAngles++
    }
  })

  if (comparedAngles === 0) return 0

  const averageDifference = totalDifference / comparedAngles
  const similarity = Math.max(
    0,
    100 - (averageDifference / maxDifference) * 100
  )

  return Math.round(similarity)
}
