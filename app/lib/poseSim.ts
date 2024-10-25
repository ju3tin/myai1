import * as poseDetection from '@tensorflow-models/pose-detection'

import { bodyKeypoints } from './squatDetection'

function distance(
  a: poseDetection.Keypoint,
  b: poseDetection.Keypoint
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function calculateAngle(
  a: poseDetection.Keypoint,
  b: poseDetection.Keypoint,
  c: poseDetection.Keypoint
): number {
  const ab: number = distance(a, b)
  const bc: number = distance(b, c)
  const ac: number = distance(a, c)

  const cosAngle: number =
    (Math.pow(ab, 2) + Math.pow(bc, 2) - Math.pow(ac, 2)) / (2 * ab * bc)

  const angle: number = Math.acos(cosAngle) * (180 / Math.PI)
  return angle
}

function getAngles(pose: poseDetection.Pose): number[] {
  const foundKeypoints = bodyKeypoints.map((name) =>
    pose.keypoints.find((kp) => kp.name === name)
  )

  const [
    leftShoulder,
    leftElbow,
    leftWrist,
    leftHip,
    leftKnee,
    leftAnkle,
    rightShoulder,
    rightElbow,
    rightWrist,
    rightHip,
    rightKnee,
    rightAnkle,
  ] = foundKeypoints as poseDetection.Keypoint[]

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
  const leftShoulderAngle = calculateAngle(leftElbow, leftShoulder, leftHip)
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)

  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
  const rightShoulderAngle = calculateAngle(rightElbow, rightShoulder, rightHip)
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  return [
    leftElbowAngle,
    leftShoulderAngle,
    leftHipAngle,
    leftKneeAngle,
    rightElbowAngle,
    rightShoulderAngle,
    rightHipAngle,
    rightKneeAngle,
  ]
}

export function calculatePoseSimilarity(
  origin: poseDetection.Pose,
  target: poseDetection.Pose
): number {
  const originAngles = getAngles(origin)
  const targetAngles = getAngles(target)

  // Calculate total angle difference and valid angles
  let totalAngleDiff = 0
  let validAngles = 0

  for (let i = 0; i < originAngles.length; i++) {
    if (originAngles[i] !== null && targetAngles[i] !== null) {
      const angleDiff = Math.abs(originAngles[i] - targetAngles[i])
      totalAngleDiff += angleDiff
      validAngles++
    }
  }

  // Calculate average angle difference and convert to similarity score
  const avgAngleDiff = totalAngleDiff / validAngles
  const similarity = Math.max(0, 1 - avgAngleDiff / 180)

  return similarity
}
