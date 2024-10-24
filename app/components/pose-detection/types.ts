import * as poseDetection from '@tensorflow-models/pose-detection'

export interface PoseLogEntry {
  id: string
  timestamp: number
  screenshot: string
  pose: poseDetection.Pose
  similarity: number
}
