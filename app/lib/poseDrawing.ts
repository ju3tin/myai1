import { Pose } from '@tensorflow-models/pose-detection'

export function drawPose(
  ctx: CanvasRenderingContext2D,
  poses: Pose[],
  videoWidth: number,
  videoHeight: number,
  skipEarNoseEye: boolean = true,
  clearCanvas: boolean = true
) {
  if (poses.length === 0) return

  ctx.canvas.width = videoWidth
  ctx.canvas.height = videoHeight
  if (clearCanvas) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  poses[0].keypoints.forEach((keypoint) => {
    if (
      skipEarNoseEye &&
      ['left_ear', 'right_ear', 'nose', 'left_eye', 'right_eye'].includes(
        keypoint.name ?? ''
      )
    )
      return

    if (keypoint.score && keypoint.score > 0) {
      ctx.beginPath()
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()

      ctx.font = '12px Arial'
      const text = keypoint.name ?? 'unnamed'

      ctx.fillStyle = 'black'
      ctx.fillRect(
        keypoint.x + 5,
        keypoint.y - 20,
        ctx.measureText(text).width + 4,
        20
      )

      ctx.fillStyle = 'white'
      ctx.fillText(text, keypoint.x + 5, keypoint.y - 5)
    }
  })

  // Draw skeleton
  const skeleton = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
    ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'],
    ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'],
    ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'],
    ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'],
    ['right_knee', 'right_ankle'],
  ]

  skeleton.forEach(([startPoint, endPoint]) => {
    const start = poses[0].keypoints.find((kp) => kp.name === startPoint)
    const end = poses[0].keypoints.find((kp) => kp.name === endPoint)
    if (
      start &&
      end &&
      start.score &&
      end.score &&
      start.score > 0.3 &&
      end.score > 0.3
    ) {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  })
}
