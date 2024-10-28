import * as poseDetection from '@tensorflow-models/pose-detection'

export function normalizePose(pose: poseDetection.Pose): poseDetection.Pose {
  // 1. 计算躯干方向（以肩部中点到臀部中点的向量为基准）
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const rightShoulder = pose.keypoints.find(
    (kp) => kp.name === 'right_shoulder'
  )
  const leftHip = pose.keypoints.find((kp) => kp.name === 'left_hip')
  const rightHip = pose.keypoints.find((kp) => kp.name === 'right_hip')

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return pose
  }

  // 计算躯干中心线
  const shoulderCenter = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  }
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  }

  // 2. 计算当前姿势的旋转角度
  const angle = Math.atan2(
    hipCenter.y - shoulderCenter.y,
    hipCenter.x - shoulderCenter.x
  )

  // 3. 创建旋转矩阵
  const rotationMatrix = {
    cos: Math.cos(-angle),
    sin: Math.sin(-angle),
  }

  // 4. 对所有关键点进行旋转变换
  const normalizedKeypoints = pose.keypoints.map((keypoint) => {
    // 相对于躯干中心的坐标
    const relativeX = keypoint.x - shoulderCenter.x
    const relativeY = keypoint.y - shoulderCenter.y

    // 应用旋转变换
    const rotatedX =
      relativeX * rotationMatrix.cos - relativeY * rotationMatrix.sin
    const rotatedY =
      relativeX * rotationMatrix.sin + relativeY * rotationMatrix.cos

    return {
      ...keypoint,
      x: rotatedX + shoulderCenter.x,
      y: rotatedY + shoulderCenter.y,
    }
  })

  return { ...pose, keypoints: normalizedKeypoints }
}
