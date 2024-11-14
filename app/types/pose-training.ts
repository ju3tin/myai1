export interface PoseCheckConfig {
  id: string
  type: 'angle' | 'height' | 'duration' | 'count'
  targetValue?: number
  joints?: string[]
  points?: string[]
  comparison?: 'greater' | 'less' | 'equal'
  standardValue?: number
  tolerance?: number
  durationRange?: { min: number; max: number }
  countRange?: { min: number; max: number }
}

export interface PracticeResult {
  timestamp: number
  checkId: string
  value: number
  isPassing: boolean
  duration?: number
  count?: number
}

export interface PoseJoint {
  name: string
  label: string
}

export const POSE_JOINTS: PoseJoint[] = [
  { name: 'leftShoulder', label: 'Left Shoulder' },
  { name: 'rightShoulder', label: 'Right Shoulder' },
  { name: 'leftElbow', label: 'Left Elbow' },
  { name: 'rightElbow', label: 'Right Elbow' },
  { name: 'leftHip', label: 'Left Hip' },
  { name: 'rightHip', label: 'Right Hip' },
  { name: 'leftKnee', label: 'Left Knee' },
  { name: 'rightKnee', label: 'Right Knee' },
  // Add more joints as needed
]
