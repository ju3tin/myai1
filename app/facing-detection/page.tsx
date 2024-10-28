import FacingDetector from '@/app/components/pose-detection/FacingDetector'

export default function FacingDetectionPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">正面检测</h1>
      <FacingDetector />
    </div>
  )
}
