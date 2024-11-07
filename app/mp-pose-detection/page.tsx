import { MPPoseDetection } from '@/app/components/mp-pose-detection/MPPoseDetection'
import { MPPoseDetectorProvider } from '@/app/contexts/MPPoseDetectorContext'

export default function MPPoseDetectionPage() {
  return (
    <MPPoseDetectorProvider>
      <MPPoseDetection />
    </MPPoseDetectorProvider>
  )
}
