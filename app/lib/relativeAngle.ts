import * as poseDetection from '@tensorflow-models/pose-detection'

function getMidpoint(
  a: poseDetection.Keypoint | undefined,
  b: poseDetection.Keypoint | undefined
): poseDetection.Keypoint {
  if (!a || !b) {
    throw new Error('Invalid keypoints')
  }
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  }
}

function normalizeAngle(angle: number): number {
  return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI
}

// 以躯干为参考计算其他部位的相对角度
function getTorsoAngle(pose: poseDetection.Pose): number {
  const shoulders = getMidpoint(
    pose.keypoints.find((kp) => kp.name === 'left_shoulder'),
    pose.keypoints.find((kp) => kp.name === 'right_shoulder')
  )
  const hips = getMidpoint(
    pose.keypoints.find((kp) => kp.name === 'left_hip'),
    pose.keypoints.find((kp) => kp.name === 'right_hip')
  )
  return Math.atan2(hips.y - shoulders.y, hips.x - shoulders.x)
}

export function calculateRelativeAngles(
  pose: poseDetection.Pose
): Map<string, number> {
  const angles = new Map<string, number>()

  const torsoAngle = getTorsoAngle(pose)

  // 计算各部位相对于躯干的角度
  const calculateLimbAngle = (
    start: poseDetection.Keypoint,
    end: poseDetection.Keypoint
  ): number => {
    const limbAngle = Math.atan2(end.y - start.y, end.x - start.x)
    return normalizeAngle(limbAngle - torsoAngle)
  }

  // 计算各个肢体的相对角度

  // 计算上肢角度
  // 左臂
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const leftElbow = pose.keypoints.find((kp) => kp.name === 'left_elbow')
  const leftWrist = pose.keypoints.find((kp) => kp.name === 'left_wrist')

  if (leftShoulder && leftElbow) {
    angles.set('left_upper_arm', calculateLimbAngle(leftShoulder, leftElbow))
  }
  if (leftElbow && leftWrist) {
    angles.set('left_lower_arm', calculateLimbAngle(leftElbow, leftWrist))
  }

  // 右臂
  const rightShoulder = pose.keypoints.find(
    (kp) => kp.name === 'right_shoulder'
  )
  const rightElbow = pose.keypoints.find((kp) => kp.name === 'right_elbow')
  const rightWrist = pose.keypoints.find((kp) => kp.name === 'right_wrist')

  if (rightShoulder && rightElbow) {
    angles.set('right_upper_arm', calculateLimbAngle(rightShoulder, rightElbow))
  }
  if (rightElbow && rightWrist) {
    angles.set('right_lower_arm', calculateLimbAngle(rightElbow, rightWrist))
  }

  // 计算下肢角度
  // 左腿
  const leftHip = pose.keypoints.find((kp) => kp.name === 'left_hip')
  const leftKnee = pose.keypoints.find((kp) => kp.name === 'left_knee')
  const leftAnkle = pose.keypoints.find((kp) => kp.name === 'left_ankle')

  if (leftHip && leftKnee) {
    angles.set('left_upper_leg', calculateLimbAngle(leftHip, leftKnee))
  }
  if (leftKnee && leftAnkle) {
    angles.set('left_lower_leg', calculateLimbAngle(leftKnee, leftAnkle))
  }

  // 右腿
  const rightHip = pose.keypoints.find((kp) => kp.name === 'right_hip')
  const rightKnee = pose.keypoints.find((kp) => kp.name === 'right_knee')
  const rightAnkle = pose.keypoints.find((kp) => kp.name === 'right_ankle')

  if (rightHip && rightKnee) {
    angles.set('right_upper_leg', calculateLimbAngle(rightHip, rightKnee))
  }
  if (rightKnee && rightAnkle) {
    angles.set('right_lower_leg', calculateLimbAngle(rightKnee, rightAnkle))
  }

  return angles
}

// 计算旋转不变的相似度
export function calculateRelativeAngleSimilarity(
  origin: poseDetection.Pose,
  target: poseDetection.Pose
): number {
  const originAngles = calculateRelativeAngles(origin)
  const targetAngles = calculateRelativeAngles(target)

  // 比较相对角度的差异
  let totalDifference = 0
  let count = 0

  originAngles.forEach((angle, key) => {
    if (targetAngles.has(key)) {
      const diff = Math.abs(normalizeAngle(angle - targetAngles.get(key)!))
      totalDifference += diff
      count++
    }
  })

  return count > 0 ? 1 - totalDifference / count / Math.PI : 0
}
