import FacingDetector from '@/app/components/pose-detection/FacingDetector'
import { MNProvider } from '@/app/contexts/mn-context'

export default function PoseDetectionPage() {
  return (
    <MNProvider>
      <FacingDetector />
    </MNProvider>
  )
}
