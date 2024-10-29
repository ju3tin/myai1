import { Pose } from '@tensorflow-models/pose-detection'

export function drawPose(
  ctx: CanvasRenderingContext2D,
  poses: Pose[],
  videoWidth: number,
  videoHeight: number,
  skipEarNoseEye: boolean = true
) {
  if (poses.length === 0) return

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.canvas.width = videoWidth
  ctx.canvas.height = videoHeight

  ctx.save()
  ctx.scale(-1, 1)
  ctx.translate(-ctx.canvas.width, 0)

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

      ctx.save()
      ctx.scale(-1, 1)
      ctx.font = '12px Arial'
      ctx.fillStyle = 'white'
      ctx.fillText(keypoint.name ?? '', -keypoint.x + 5, keypoint.y - 5)
      ctx.restore()
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

  ctx.restore()
}
