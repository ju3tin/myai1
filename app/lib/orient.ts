import * as poseDetection from '@tensorflow-models/pose-detection'

export enum Direction {
  Front = 'front',
  Side = 'side',
  Back = 'back',
  Unknown = 'unknown',
}

export function estimateOrientation(pose: poseDetection.Pose): {
  angle: number
  direction: Direction
  isValid: boolean
} {
  // 获取关键点
  const nose = pose.keypoints.find((kp) => kp.name === 'nose')
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const rightShoulder = pose.keypoints.find(
    (kp) => kp.name === 'right_shoulder'
  )
  const leftEye = pose.keypoints.find((kp) => kp.name === 'left_eye')
  const rightEye = pose.keypoints.find((kp) => kp.name === 'right_eye')
  const leftEar = pose.keypoints.find((kp) => kp.name === 'left_ear')
  const rightEar = pose.keypoints.find((kp) => kp.name === 'right_ear')

  // 检查关键点是否都存在且置信度达标
  const minConfidence = 0.3
  if (
    !nose?.score ||
    !leftShoulder?.score ||
    !rightShoulder?.score ||
    !leftEye?.score ||
    !rightEye?.score ||
    !leftEar?.score ||
    !rightEar?.score ||
    Math.min(
      nose.score,
      leftShoulder.score,
      rightShoulder.score,
      leftEye.score,
      rightEye.score,
      leftEar.score,
      rightEar.score
    ) < minConfidence
  ) {
    return { angle: 0, direction: Direction.Unknown, isValid: false }
  }

  // 计算鼻子相对于肩膀中点的位置
  const shoulderCenter = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  }

  // 计算鼻子到肩膀中点的水平偏移
  const noseOffset = nose.x - shoulderCenter.x

  // 检查是否能看到两只耳朵
  const bothEarsVisible =
    leftEar.score > minConfidence && rightEar.score > minConfidence

  // 检查是否能看到两只眼睛
  const bothEyesVisible =
    leftEye.score > minConfidence && rightEye.score > minConfidence

  // 使用空间特征判断朝向
  let angle: number
  let direction: Direction

  // 前面的特征:
  // 1. 两只耳朵和眼睛都清晰可见
  // 2. 鼻子大致在肩膀中点上方
  const isFront =
    bothEarsVisible && bothEyesVisible && Math.abs(noseOffset) < 30 // 可调整的阈值

  // 侧面的特征:
  // 1. 只能清晰看到一只耳朵
  // 2. 鼻子明显偏离肩膀中点
  const isSide =
    (!bothEarsVisible || !bothEyesVisible) && Math.abs(noseOffset) > 30 // 可调整的阈值

  if (isFront) {
    angle = 0
    direction = Direction.Front
  } else if (isSide) {
    angle = 90
    direction = Direction.Side
  } else {
    // 如果既不符合正面也不符合侧面特征,可能是背面
    angle = 180
    direction = Direction.Back
  }

  return {
    angle,
    direction,
    isValid:
      direction === Direction.Front &&
      Math.min(nose.score, leftShoulder.score, rightShoulder.score) >
        minConfidence,
  }
}
