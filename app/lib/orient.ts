import * as poseDetection from '@tensorflow-models/pose-detection'
import { dir } from 'console'

export enum Direction {
  Front = 'front',
  Side = 'side',
  Back = 'back'
}

export function estimateOrientation(pose: poseDetection.Pose): {
  angle: number
  direction: Direction
  isValid: boolean
} {
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const rightShoulder = pose.keypoints.find(
    (kp) => kp.name === 'right_shoulder'
  )
  const leftHip = pose.keypoints.find((kp) => kp.name === 'left_hip')
  const rightHip = pose.keypoints.find((kp) => kp.name === 'right_hip')

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return { angle: 0, direction: Direction.Front, isValid: false }
  }

  // 计算肩部宽度
  const shoulderWidth = Math.sqrt(
    Math.pow(rightShoulder.x - leftShoulder.x, 2) +
      Math.pow(rightShoulder.y - leftShoulder.y, 2)
  )

  // 计算臀部宽度
  const hipWidth = Math.sqrt(
    Math.pow(rightHip.x - leftHip.x, 2) + Math.pow(rightHip.y - leftHip.y, 2)
  )

  // 计算肩部宽度和臀部宽度的比例
  const widthRatio = shoulderWidth / hipWidth

  // 估计旋转角度(0-180度)
  const angle = Math.acos(widthRatio / 1.5) * (180 / Math.PI)

  // 判断朝向
  let direction: Direction
  if (angle < 30) {
    direction = Direction.Front
  } else if (angle > 150) {
    direction = Direction.Back
  } else {
    direction = Direction.Side
  }

  return { angle, direction, isValid: direction === Direction.Front }
}
