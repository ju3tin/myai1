import { MNProvider } from '@/app/contexts/mn-context'
import FacingDetector from '@/app/components/pose-detection/FacingDetector'

export default function PoseDetectionPage() {
  return (
    <MNProvider>
      <FacingDetector />
    </MNProvider>
  )
}
