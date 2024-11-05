import * as poseDetection from '@tensorflow-models/pose-detection'

const connections = [
  ['nose', 'left_eye'],
  ['left_eye', 'left_ear'],
  ['nose', 'right_eye'],
  ['right_eye', 'right_ear'],
  ['nose', 'left_shoulder'],
  ['left_shoulder', 'left_elbow'],
  ['left_elbow', 'left_wrist'],
  ['nose', 'right_shoulder'],
  ['right_shoulder', 'right_elbow'],
  ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_hip'],
  ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'],
  ['left_knee', 'left_ankle'],
  ['right_hip', 'right_knee'],
  ['right_knee', 'right_ankle'],
]

export function draw3DPose(
  ctx: CanvasRenderingContext2D,
  pose: poseDetection.Pose,
  videoWidth: number,
  videoHeight: number,
  flipHorizontal: boolean = false
) {
  // Clear canvas
  ctx.clearRect(0, 0, videoWidth, videoHeight)

  // Set canvas size to match video
  ctx.canvas.width = videoWidth
  ctx.canvas.height = videoHeight

  // Flip horizontally
  if (flipHorizontal) {
    ctx.translate(videoWidth, 0)
    ctx.scale(-1, 1)
  }

  // Draw keypoints
  pose.keypoints3D?.forEach((keypoint) => {
    if (keypoint.score && keypoint.score > 0.3) {
      const x = keypoint.x * videoWidth
      const y = keypoint.y * videoHeight
      const z = keypoint.z || 0

      // Adjust point size based on Z depth
      const radius = Math.max(4, 8 - Math.abs(z) * 2)

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      // yellow point
      ctx.fillStyle = `rgba(255, 255, 0, ${0.7 + z * 0.3})`
      ctx.fill()
    }
  })

  // Draw connections
  connections.forEach(([start, end]) => {
    const startPoint = pose.keypoints3D?.find((kp) => kp.name === start)
    const endPoint = pose.keypoints3D?.find((kp) => kp.name === end)

    if (
      startPoint?.score &&
      endPoint?.score &&
      startPoint.score > 0.3 &&
      endPoint.score > 0.3
    ) {
      ctx.beginPath()
      ctx.moveTo(startPoint.x * videoWidth, startPoint.y * videoHeight)
      ctx.lineTo(endPoint.x * videoWidth, endPoint.y * videoHeight)

      // Adjust line color based on Z depth
      const avgZ = ((startPoint.z || 0) + (endPoint.z || 0)) / 2
      // red line
      ctx.strokeStyle = `rgba(255, 0, 0, ${0.7 + avgZ * 0.3})`
      ctx.lineWidth = 2
      ctx.stroke()
    }
  })
}
