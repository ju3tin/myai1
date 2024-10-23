import * as poseDetection from '@tensorflow-models/pose-detection'

interface Feedback {
  isCorrect: boolean
  message: string
}

const CONFIDENCE_THRESHOLD = 0.3

export enum SquatPhase {
  STANDING,
  SQUATTING,
  RISING,
}

export function detectSquat({
  pose,
  squatPhase,
  setSquatCount,
  setFeedback,
}: {
  pose: poseDetection.Pose
  squatPhase: React.MutableRefObject<SquatPhase>
  setSquatCount: React.Dispatch<React.SetStateAction<number>>
  setFeedback: React.Dispatch<React.SetStateAction<Feedback>>
}): void {
  const keypoints = [
    'left_shoulder',
    'left_elbow',
    'left_wrist',
    'left_hip',
    'left_knee',
    'left_ankle',
    'right_shoulder',
    'right_elbow',
    'right_wrist',
    'right_hip',
    'right_knee',
    'right_ankle',
  ]

  const foundKeypoints = keypoints.map((name) =>
    pose.keypoints.find((kp) => kp.name === name)
  )

  if (
    foundKeypoints.some((kp) => !kp || (kp.score ?? 0) < CONFIDENCE_THRESHOLD)
  ) {
    setFeedback({ isCorrect: false, message: '请确保您的全身在摄像头视野内' })
    return
  }

  const [
    leftShoulder,
    leftElbow,
    leftWrist,
    leftHip,
    leftKnee,
    leftAnkle,
    rightShoulder,
    rightElbow,
    rightWrist,
    rightHip,
    rightKnee,
    rightAnkle,
  ] = foundKeypoints as poseDetection.Keypoint[]

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist)
  const leftShoulderAngle = calculateAngle(leftElbow, leftShoulder, leftHip)
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee)
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle)

  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist)
  const rightShoulderAngle = calculateAngle(rightElbow, rightShoulder, rightHip)
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee)
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle)

  const isStanding =
    leftHipAngle > 160 &&
    rightHipAngle > 160 &&
    leftKneeAngle > 160 &&
    rightKneeAngle > 160
  const isSquatting =
    leftHipAngle < 100 &&
    rightHipAngle < 100 &&
    leftKneeAngle < 100 &&
    rightKneeAngle < 100
  const isRising =
    leftHipAngle > 100 &&
    leftHipAngle < 160 &&
    rightHipAngle > 100 &&
    rightHipAngle < 160

  switch (squatPhase.current) {
    case SquatPhase.STANDING:
      if (isSquatting) {
        squatPhase.current = SquatPhase.SQUATTING
        setFeedback({ isCorrect: true, message: '下蹲姿势正确！' })
      }
      break
    case SquatPhase.SQUATTING:
      if (isRising) {
        squatPhase.current = SquatPhase.RISING
        setFeedback({ isCorrect: true, message: '开始起身！' })
      }
      break
    case SquatPhase.RISING:
      if (isStanding) {
        squatPhase.current = SquatPhase.STANDING
        setSquatCount((prev) => prev + 1)
        setFeedback({ isCorrect: true, message: '完成一次深蹲！' })
      }
      break
  }

  // Provide feedback
  if (!isStanding && !isSquatting && !isRising) {
    const feedback = checkSquatForm(
      leftElbowAngle,
      leftShoulderAngle,
      rightElbowAngle,
      rightShoulderAngle,
      leftHipAngle,
      rightHipAngle,
      leftKneeAngle,
      rightKneeAngle
    )
    setFeedback(feedback)
  }
}

function calculateAngle(
  a: poseDetection.Keypoint,
  b: poseDetection.Keypoint,
  c: poseDetection.Keypoint
): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  let angle = Math.abs((radians * 180.0) / Math.PI)
  if (angle > 180.0) angle = 360 - angle
  return angle
}

function checkSquatForm(
  leftElbowAngle: number,
  leftShoulderAngle: number,
  rightElbowAngle: number,
  rightShoulderAngle: number,
  leftHipAngle: number,
  rightHipAngle: number,
  leftKneeAngle: number,
  rightKneeAngle: number
): Feedback {
  if (leftElbowAngle <= 130 || rightElbowAngle <= 130) {
    return { isCorrect: false, message: 'Keep your arms straighter' }
  }

  if (
    leftShoulderAngle <= 30 ||
    leftShoulderAngle >= 120 ||
    rightShoulderAngle <= 30 ||
    rightShoulderAngle >= 120
  ) {
    return { isCorrect: false, message: 'Adjust your arm position' }
  }

  if (leftHipAngle >= 130 || rightHipAngle >= 130) {
    return { isCorrect: false, message: 'Lower your hips more' }
  }

  if (Math.abs(leftKneeAngle - rightKneeAngle) > 15) {
    return { isCorrect: false, message: 'Keep your knees aligned' }
  }

  if (leftKneeAngle < 60 || rightKneeAngle < 60) {
    return { isCorrect: false, message: "Don't go too low, protect your knees" }
  }

  return { isCorrect: true, message: 'Good squat form!' }
}
