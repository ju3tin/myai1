import { PoseTraining } from '@/app/components/pose-training/PoseTraining'
import { MPPoseDetectorProvider } from '@/app/contexts/MPPoseDetectorContext'

export default function PoseComparisonPage() {
  return (
    <MPPoseDetectorProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pose Training</h1>
        <PoseTraining />
      </div>
    </MPPoseDetectorProvider>
  )
}
