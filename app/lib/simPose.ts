import * as poseDetection from '@tensorflow-models/pose-detection'

import { calculateInvariantFeaturesSimilarity } from './invariantFeature'
import { normalizePose } from './normPose'
import { calculatePoseSimilarity as calculateKeyAngleSimilarity } from './poseSim'
import { calculateRelativeAngleSimilarity } from './relativeAngle'

export enum SimilarityStrategy {
  KEY_ANGLES = 'keyAngles',
  RELATIVE_ANGLES = 'relativeAngles',
  INVARIANT_FEATURES = 'invariantFeatures',
}

interface SimilarityOptions {
  strategy: SimilarityStrategy
  selectedAngles?: string[] // 用于KEY_ANGLES策略
  normalize?: boolean // 是否需要姿势标准化
}

function adjustSimilarity(similarity: number): number {
  // 使用幂函数增加区分度，可以根据需要调整幂指数
  const power = 2
  return Math.pow(similarity, power)
}

function calculatePoseSimilarity(
  pose1: poseDetection.Pose,
  pose2: poseDetection.Pose,
  options: SimilarityOptions
): number {
  const normalizedPose1 = options.normalize ? normalizePose(pose1) : pose1
  const normalizedPose2 = options.normalize ? normalizePose(pose2) : pose2

  switch (options.strategy) {
    case SimilarityStrategy.KEY_ANGLES:
      return calculateKeyAngleSimilarity(
        normalizedPose1,
        normalizedPose2,
        options.selectedAngles || [],
        false // 已经在外部处理了标准化，这里传false
      )

    case SimilarityStrategy.RELATIVE_ANGLES:
      return calculateRelativeAngleSimilarity(normalizedPose1, normalizedPose2)

    case SimilarityStrategy.INVARIANT_FEATURES:
      return calculateInvariantFeaturesSimilarity(
        normalizedPose1,
        normalizedPose2
      )

    default:
      throw new Error(`Unknown similarity strategy: ${options.strategy}`)
  }
}

// 使用组合策略计算综合相似度
export function calculateCombinedSimilarity(
  pose1: poseDetection.Pose,
  pose2: poseDetection.Pose,
  options: {
    strategies: {
      strategy: SimilarityStrategy
      weight: number
      selectedAngles?: string[]
    }[]
    normalize?: boolean
  }
): number {
  let totalWeight = 0
  let weightedSimilarity = 0

  options.strategies.forEach(({ strategy, weight, selectedAngles }) => {
    const similarity = calculatePoseSimilarity(pose1, pose2, {
      strategy,
      selectedAngles,
      normalize: options.normalize,
    })
    weightedSimilarity += similarity * weight
    totalWeight += weight
  })

  return adjustSimilarity(
    totalWeight > 0 ? weightedSimilarity / totalWeight : 0
  )
}
