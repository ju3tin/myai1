import { PoseDetection3D } from '@/app/components/pose-detection-3d/'
import { PoseDetectorProvider } from '@/app/contexts/PoseDetectorContext'

export default function PoseDetection3DPage() {
  return (
    <PoseDetectorProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">3D Pose Detection</h1>
        <PoseDetection3D />
      </div>
    </PoseDetectorProvider>
  )
}
