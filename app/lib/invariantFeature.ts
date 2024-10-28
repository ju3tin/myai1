import * as poseDetection from '@tensorflow-models/pose-detection'

import { calculateRelativeAngles } from './relativeAngle'

// 定义身体段类型
interface BodySegment {
  name: string
  start: string
  end: string
}

// 定义身体段配置
const bodySegments: BodySegment[] = [
  { name: 'leftUpperArm', start: 'left_shoulder', end: 'left_elbow' },
  { name: 'leftLowerArm', start: 'left_elbow', end: 'left_wrist' },
  { name: 'rightUpperArm', start: 'right_shoulder', end: 'right_elbow' },
  { name: 'rightLowerArm', start: 'right_elbow', end: 'right_wrist' },
  { name: 'leftUpperLeg', start: 'left_hip', end: 'left_knee' },
  { name: 'leftLowerLeg', start: 'left_knee', end: 'left_ankle' },
  { name: 'rightUpperLeg', start: 'right_hip', end: 'right_knee' },
  { name: 'rightLowerLeg', start: 'right_knee', end: 'right_ankle' },
  { name: 'torso', start: 'left_shoulder', end: 'left_hip' },
]

interface Distribution {
  width: number
  height: number
  aspect: number
}

interface SpatialPattern {
  symmetry: number
  distribution: Distribution
}

// 定义拓扑类型
interface Topology {
  jointRelations: Map<string, string>
  intersections: Map<string, boolean>
  spatialPattern: SpatialPattern
}

export function calculateInvariantFeaturesSimilarity(
  pose1: poseDetection.Pose,
  pose2: poseDetection.Pose
): number {
  const features1 = calculateInvariantFeatures(pose1)
  const features2 = calculateInvariantFeatures(pose2)

  // 各特征权重
  const weights = {
    lengthRatios: 0.3,
    relativeAngles: 0.4,
    topology: 0.3,
  }

  // 1. 计算长度比相似度
  const lengthRatiosSimilarity = calculateLengthRatiosSimilarity(
    features1.lengthRatios,
    features2.lengthRatios
  )

  // 2. 计算相对角度相似度
  const anglesSimilarity = calculateAnglesSimilarity(
    features1.relativeAngles,
    features2.relativeAngles
  )

  // 3. 计算拓扑特征相似度
  const topologySimilarity = calculateTopologySimilarity(
    features1.topology,
    features2.topology
  )

  // 加权平均计算最终相似度
  const similarity =
    weights.lengthRatios * lengthRatiosSimilarity +
    weights.relativeAngles * anglesSimilarity +
    weights.topology * topologySimilarity

  return similarity
}

// 计算长度比相似度
function calculateLengthRatiosSimilarity(
  ratios1: Map<string, number>,
  ratios2: Map<string, number>
): number {
  let totalDiff = 0
  let count = 0

  ratios1.forEach((ratio1, key) => {
    const ratio2 = ratios2.get(key)
    if (ratio2 !== undefined) {
      totalDiff += Math.abs(ratio1 - ratio2)
      count++
    }
  })

  if (count === 0) return 0
  // 归一化差异到 0-1 范围
  return 1 - Math.min(totalDiff / count, 1)
}

// 计算角度相似度
function calculateAnglesSimilarity(
  angles1: Map<string, number>,
  angles2: Map<string, number>
): number {
  let totalDiff = 0
  let count = 0

  angles1.forEach((angle1, key) => {
    const angle2 = angles2.get(key)
    if (angle2 !== undefined) {
      // 计算角度差的绝对值，考虑角度的循环性
      let diff = Math.abs(angle1 - angle2)
      diff = Math.min(diff, 2 * Math.PI - diff)
      totalDiff += diff / Math.PI // 归一化到 0-1 范围
      count++
    }
  })

  if (count === 0) return 0
  return 1 - totalDiff / count
}

// 计算拓扑特征相似度
function calculateTopologySimilarity(
  topology1: Topology,
  topology2: Topology
): number {
  // 1. 计算关节关系相似度
  const jointRelationsSimilarity = calculateJointRelationsSimilarity(
    topology1.jointRelations,
    topology2.jointRelations
  )

  // 2. 计算交叉状态相似度
  const intersectionsSimilarity = calculateIntersectionsSimilarity(
    topology1.intersections,
    topology2.intersections
  )

  // 3. 计算空间模式相似度
  const spatialPatternSimilarity = calculateSpatialPatternSimilarity(
    topology1.spatialPattern,
    topology2.spatialPattern
  )

  // 平均计算拓扑相似度
  return (
    jointRelationsSimilarity * 0.4 +
    intersectionsSimilarity * 0.3 +
    spatialPatternSimilarity * 0.3
  )
}

// 计算关节关系相似度
function calculateJointRelationsSimilarity(
  relations1: Map<string, string>,
  relations2: Map<string, string>
): number {
  let matches = 0
  let total = 0

  relations1.forEach((value, key) => {
    if (relations2.has(key)) {
      total++
      if (value === relations2.get(key)) {
        matches++
      }
    }
  })

  return total === 0 ? 0 : matches / total
}

// 计算交叉状态相似度
function calculateIntersectionsSimilarity(
  intersections1: Map<string, boolean>,
  intersections2: Map<string, boolean>
): number {
  let matches = 0
  let total = 0

  intersections1.forEach((value, key) => {
    if (intersections2.has(key)) {
      total++
      if (value === intersections2.get(key)) {
        matches++
      }
    }
  })

  return total === 0 ? 0 : matches / total
}

// 计算空间模式相似度
function calculateSpatialPatternSimilarity(
  pattern1: {
    symmetry: number
    distribution: {
      width: number
      height: number
      aspect: number
    }
  },
  pattern2: {
    symmetry: number
    distribution: {
      width: number
      height: number
      aspect: number
    }
  }
): number {
  // 对称性相似度
  const symmetrySimilarity = 1 - Math.abs(pattern1.symmetry - pattern2.symmetry)

  // 分布相似度（考虑宽高比）
  const aspectRatioDiff = Math.abs(
    pattern1.distribution.aspect - pattern2.distribution.aspect
  )
  const distributionSimilarity = 1 - Math.min(aspectRatioDiff, 1)

  return (symmetrySimilarity + distributionSimilarity) / 2
}

// 计算姿势的不变特征
export function calculateInvariantFeatures(pose: poseDetection.Pose) {
  return {
    lengthRatios: calculateLengthRatios(pose),
    relativeAngles: calculateRelativeAngles(pose),
    topology: calculateTopologicalFeatures(pose),
  }
}

// 计算两点之间的距离
function distance(
  p1: poseDetection.Keypoint,
  p2: poseDetection.Keypoint
): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

// 计算身体段长度
function calculateSegmentLength(
  pose: poseDetection.Pose,
  segment: BodySegment
): number {
  const startPoint = pose.keypoints.find((kp) => kp.name === segment.start)
  const endPoint = pose.keypoints.find((kp) => kp.name === segment.end)

  if (!startPoint || !endPoint) {
    return 0
  }

  return distance(startPoint, endPoint)
}

// 获取身高(使用左右肩距离作为参考)
function getHeight(pose: poseDetection.Pose): number {
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const rightShoulder = pose.keypoints.find(
    (kp) => kp.name === 'right_shoulder'
  )

  if (!leftShoulder || !rightShoulder) {
    return 0
  }

  return distance(leftShoulder, rightShoulder)
}

// 计算长度比
function calculateLengthRatios(pose: poseDetection.Pose) {
  const ratios = new Map<string, number>()
  const height = getHeight(pose)

  if (height === 0) return ratios

  bodySegments.forEach((segment) => {
    const length = calculateSegmentLength(pose, segment)
    ratios.set(segment.name, length / height)
  })

  return ratios
}

// 计算关节间的相对位置关系
function getJointRelations(pose: poseDetection.Pose) {
  const relations = new Map<string, string>()

  // 检查左右手相对位置
  const leftWrist = pose.keypoints.find((kp) => kp.name === 'left_wrist')
  const rightWrist = pose.keypoints.find((kp) => kp.name === 'right_wrist')
  if (leftWrist && rightWrist) {
    relations.set('hands', leftWrist.x < rightWrist.x ? 'normal' : 'crossed')
  }

  // 检查手臂相对于躯干的位置
  const leftShoulder = pose.keypoints.find((kp) => kp.name === 'left_shoulder')
  const leftElbow = pose.keypoints.find((kp) => kp.name === 'left_elbow')
  if (leftShoulder && leftElbow) {
    relations.set(
      'leftArm',
      leftElbow.y < leftShoulder.y ? 'raised' : 'lowered'
    )
  }

  return relations
}

// 检查肢体交叉
function checkLimbIntersections(pose: poseDetection.Pose) {
  const intersections = new Map<string, boolean>()

  // 检查手臂交叉
  const leftArm = {
    start: pose.keypoints.find((kp) => kp.name === 'left_shoulder'),
    end: pose.keypoints.find((kp) => kp.name === 'left_wrist'),
  }
  const rightArm = {
    start: pose.keypoints.find((kp) => kp.name === 'right_shoulder'),
    end: pose.keypoints.find((kp) => kp.name === 'right_wrist'),
  }

  if (leftArm.start && leftArm.end && rightArm.start && rightArm.end) {
    intersections.set(
      'arms',
      doLinesIntersect(leftArm.start, leftArm.end, rightArm.start, rightArm.end)
    )
  }

  return intersections
}

// 判断两线段是否相交
function doLinesIntersect(
  p1: poseDetection.Keypoint,
  p2: poseDetection.Keypoint,
  p3: poseDetection.Keypoint,
  p4: poseDetection.Keypoint
): boolean {
  const ccw = (
    A: poseDetection.Keypoint,
    B: poseDetection.Keypoint,
    C: poseDetection.Keypoint
  ) => {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
  }

  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  )
}

// 分析空间排列模式
function analyzeSpatialPattern(pose: poseDetection.Pose): SpatialPattern {
  const pattern = {
    symmetry: calculateSymmetry(pose),
    distribution: analyzeKeypointDistribution(pose),
  }
  return pattern
}

// 计算对称性
function calculateSymmetry(pose: poseDetection.Pose): number {
  let symmetryScore = 0
  let count = 0

  // 比较左右对称点的位置
  const pairs = [
    ['left_shoulder', 'right_shoulder'],
    ['left_elbow', 'right_elbow'],
    ['left_wrist', 'right_wrist'],
    ['left_hip', 'right_hip'],
    ['left_knee', 'right_knee'],
    ['left_ankle', 'right_ankle'],
  ]

  pairs.forEach(([leftName, rightName]) => {
    const leftPoint = pose.keypoints.find((kp) => kp.name === leftName)
    const rightPoint = pose.keypoints.find((kp) => kp.name === rightName)

    if (leftPoint && rightPoint) {
      const yDiff = Math.abs(leftPoint.y - rightPoint.y)
      symmetryScore += 1 - Math.min(yDiff / 100, 1) // 归一化差异
      count++
    }
  })

  return count > 0 ? symmetryScore / count : 0
}

// 分析关键点分布
function analyzeKeypointDistribution(pose: poseDetection.Pose): Distribution {
  // 计算关键点的空间分布特征
  const points = pose.keypoints.filter((kp) => kp.score && kp.score > 0.3)

  if (points.length === 0) return { width: 0, height: 0, aspect: 0 }

  // 计算边界框
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))

  return {
    width: maxX - minX,
    height: maxY - minY,
    aspect: (maxX - minX) / (maxY - minY),
  }
}

// 计算拓扑特征
function calculateTopologicalFeatures(pose: poseDetection.Pose): Topology {
  return {
    jointRelations: getJointRelations(pose),
    intersections: checkLimbIntersections(pose),
    spatialPattern: analyzeSpatialPattern(pose),
  }
}
