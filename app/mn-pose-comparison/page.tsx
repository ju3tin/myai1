import { MNPoseComparison } from '@/app/components/mn-pose-comparison/MNPoseComparison'
import { MNProvider } from '@/app/contexts/mn-context'

export default function MNPoseComparisonPage() {
  return (
    <MNProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">MoveNet Pose Comparison</h1>
        <MNPoseComparison />
      </div>
    </MNProvider>
  )
}
