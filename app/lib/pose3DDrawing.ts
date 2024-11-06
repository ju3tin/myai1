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
  console.log(pose)
  ctx.canvas.width = videoWidth
  ctx.canvas.height = videoHeight
  ctx.clearRect(0, 0, videoWidth, videoHeight)

  if (flipHorizontal) {
    ctx.scale(-1, 1)
    ctx.translate(-videoWidth, 0)
  }

  // Draw keypoints with depth-based visualization
  pose.keypoints?.forEach((keypoint) => {
    if (!keypoint.score || keypoint.score <= 0.3) return

    const x = keypoint.x
    const y = keypoint.y
    const z = keypoint.z || 0

    // Adjust point size and color based on Z depth
    const radius = Math.max(4, 8 - Math.abs(z) * 2)
    const opacity = normalizeDepth(z)

    // Color points based on body part type
    let color = '#ff0000' // Default red
    if (keypoint.name?.includes('left_')) color = '#00ff00' // Green for left
    if (keypoint.name?.includes('right_')) color = '#ffa500' // Orange for right
    if (keypoint.name === 'nose') color = '#ffffff' // White for nose

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = `${color}${Math.floor(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`
    ctx.fill()
  })

  // Draw connections with depth-based colors
  connections.forEach(([start, end]) => {
    const startPoint = pose.keypoints?.find((kp) => kp.name === start)
    const endPoint = pose.keypoints?.find((kp) => kp.name === end)

    if (
      !startPoint?.score ||
      !endPoint?.score ||
      startPoint.score <= 0.3 ||
      endPoint.score <= 0.3
    )
      return

    const avgZ = ((startPoint.z || 0) + (endPoint.z || 0)) / 2
    const opacity = normalizeDepth(avgZ)

    ctx.beginPath()
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(endPoint.x, endPoint.y)
    ctx.strokeStyle = `#ffffff${Math.floor(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`
    ctx.lineWidth = 2
    ctx.stroke()
  })
}

// Helper function to normalize depth values to opacity range
function normalizeDepth(z: number): number {
  // Convert z value to opacity between 0.3 and 1.0
  return Math.max(0.3, Math.min(1.0, 1 - Math.abs(z) * 0.5))
}
