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

  // Ensure both shoulders are defined before calculating the shoulder vector
  if (!rightShoulder || !leftShoulder) {
    return { angle: 0, direction: Direction.Unknown, isValid: false }
  }

  const calculateAngle = () => {
    // 1. 使用肩膀线作为基准
    const shoulderVector = {
      x: rightShoulder.x - leftShoulder.x,
      y: rightShoulder.y - leftShoulder.y,
    }

    // Ensure the nose keypoint is defined before calculating the nose vector
    if (!nose) {
      return { angle: 0, direction: Direction.Unknown, isValid: false }
    }

    // 2. 计算肩膀中点到鼻子的向量
    const noseVector = {
      x: nose.x - shoulderCenter.x,
      y: nose.y - shoulderCenter.y,
    }

    // Ensure both ears are defined before calculating the ear difference
    if (!leftEar || !rightEar) {
      return { angle: 0, direction: Direction.Unknown, isValid: false }
    }

    // 3. 计算耳朵的水平距离差
    const earDiff = Math.abs(rightEar.x - leftEar.x)

    // 4. 计算夹角
    // 使用 Math.atan2 计算向量与 Y 轴的夹角
    let angle = Math.atan2(noseVector.x, -noseVector.y) * (180 / Math.PI)

    // 5. 根据耳朵可见性调整角度
    const earRatio = earDiff / shoulderVector.x // 耳朵距离与肩膀宽度的比率

    // 标准化角度到 0-360 度
    angle = ((angle % 360) + 360) % 360

    // 6. 根据特征调整角度
    if (isFront) {
      // 如果判定为正面，根据鼻子偏移微调角度
      angle = noseOffset * 2 // 可以调整系数
    } else if (isSide) {
      // 如果判定为侧面，根据耳朵比例调整角度
      const sideAngle = noseOffset > 0 ? 90 : -90
      angle = sideAngle + (noseOffset > 0 ? -1 : 1) * (1 - earRatio) * 30 // 可以调整系数
    }

    return angle
  }

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
  let direction: Direction

  // 前面的特征:
  // 1. 两只耳朵和眼睛都清晰可见
  // 2. 鼻子大致在肩膀中点上方
  const isFront =
    bothEarsVisible && bothEyesVisible && Math.abs(noseOffset) < 15 // 可调整的阈值

  // 侧面的特征:
  // 1. 只能清晰看到一只耳朵
  // 2. 鼻子明显偏离肩膀中点
  const isSide = bothEarsVisible && bothEyesVisible && Math.abs(noseOffset) > 15 // 可调整的阈值

  if (isFront) {
    direction = Direction.Front
  } else if (isSide) {
    direction = Direction.Side
  } else {
    // 如果既不符合正面也不符合侧面特征,可能是背面
    direction = Direction.Back
  }

  return {
    angle: calculateAngle(),
    direction,
    isValid:
      direction === Direction.Front &&
      Math.min(nose.score, leftShoulder.score, rightShoulder.score) >
        minConfidence,
  }
}
