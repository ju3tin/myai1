import { TMPoseComparison } from '@/app/components//tm-pose-comparison/TMPoseComparison'
import { PoseDetectorProvider } from '@/app/contexts/PoseDetectorContext'

export default function TMPoseComparisonPage() {
  return (
    <PoseDetectorProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          TFJS BlazePose Pose Comparison
        </h1>
        <TMPoseComparison />
      </div>
    </PoseDetectorProvider>
  )
}
