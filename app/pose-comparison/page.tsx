import { PoseComparison } from '@/app/components/pose-comparison/PoseComparison'
import { MPPoseDetectorProvider } from '@/app/contexts/MPPoseDetectorContext'

export default function PoseComparisonPage() {
  return (
    <MPPoseDetectorProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pose Comparison</h1>

        <PoseComparison />

        <div className="mt-12 prose max-w-none">
          <h2 className="text-2xl font-semibold mb-4">
            About Pose Comparison Tool
          </h2>
          <p className="mb-4">
            Our pose comparison tool leverages MediaPipe's pose detection
            technology to analyze and compare body postures from uploaded
            images. The system calculates a similarity score between two poses,
            making it ideal for fitness trainers, yoga practitioners, and dance
            instructors who want to compare and improve form.
          </p>

          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <ol className="list-decimal pl-6 mb-6">
            <li className="mb-2">
              Upload your reference image using the "Upload Image 1" button
            </li>
            <li className="mb-2">
              Upload a comparison image using the "Upload Image 2" button
            </li>
            <li className="mb-2">
              The system will automatically detect key points (landmarks) on the
              body in both images
            </li>
            <li className="mb-2">
              View the pose similarity score displayed at the top of the
              comparison
            </li>
            <li className="mb-2">
              Examine the visual skeleton overlay to see how poses differ
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mb-4">Technical Features</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Powered by MediaPipe's PoseLandmarker for accurate pose detection
            </li>
            <li className="mb-2">
              Detects 33 key body landmarks including joints, face, and
              extremities
            </li>
            <li className="mb-2">
              Calculates joint angles and compares them for similarity
              assessment
            </li>
            <li className="mb-2">
              Visual skeleton overlay shows precise body positioning
            </li>
            <li className="mb-2">
              Built with Next.js, TypeScript, and TailwindCSS
            </li>
            <li className="mb-2">
              Privacy-focused: all processing happens locally in your browser
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Applications</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">
              Fitness training: Compare your form with proper technique
            </li>
            <li className="mb-2">
              Yoga practice: Match poses with instructor references
            </li>
            <li className="mb-2">
              Physical therapy: Track progress in posture correction
            </li>
            <li className="mb-2">
              Dance instruction: Analyze and improve choreography positions
            </li>
            <li className="mb-2">
              Sports coaching: Refine athletic stances and movements
            </li>
          </ul>
        </div>
      </div>
    </MPPoseDetectorProvider>
  )
}
