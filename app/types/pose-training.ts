export interface PoseCheckConfig {
  id: string
  type: 'angle' | 'height' | 'duration' | 'count'
  joints?: [string, string, string] // For angle checks
  points?: [string, string] // For height checks
  comparison?: 'greater' | 'less' | 'equal'
  targetValue: number
  tolerance?: number
  standardValue?: number // Calculated from standard pose
  durationRange?: {
    min: number
    max: number
  }
  countRange?: {
    min: number
    max: number
  }
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
