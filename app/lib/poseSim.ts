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

function getAngles(
  pose: poseDetection.Pose,
  selectedAngles: string[] = []
): number[] {
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

  const angles: number[] = []

  if (selectedAngles.includes('leftElbowAngle')) {
    angles.push(calculateAngle(leftShoulder, leftElbow, leftWrist))
  }

  if (selectedAngles.includes('leftShoulderAngle')) {
    angles.push(calculateAngle(leftElbow, leftShoulder, leftHip))
  }

  if (selectedAngles.includes('leftHipAngle')) {
    angles.push(calculateAngle(leftShoulder, leftHip, leftKnee))
  }

  if (selectedAngles.includes('leftKneeAngle')) {
    angles.push(calculateAngle(leftHip, leftKnee, leftAnkle))
  }

  if (selectedAngles.includes('rightElbowAngle')) {
    angles.push(calculateAngle(rightShoulder, rightElbow, rightWrist))
  }

  if (selectedAngles.includes('rightShoulderAngle')) {
    angles.push(calculateAngle(rightElbow, rightShoulder, rightHip))
  }

  if (selectedAngles.includes('rightHipAngle')) {
    angles.push(calculateAngle(rightShoulder, rightHip, rightKnee))
  }

  if (selectedAngles.includes('rightKneeAngle')) {
    angles.push(calculateAngle(rightHip, rightKnee, rightAnkle))
  }

  return angles
}

export function calculatePoseSimilarity(
  origin: poseDetection.Pose,
  target: poseDetection.Pose,
  selectedAngles: string[] = []
): number {
  const originAngles = getAngles(origin, selectedAngles)
  const targetAngles = getAngles(target, selectedAngles)

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
