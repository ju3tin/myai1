import dynamic from 'next/dynamic'

const MPPoseDetection = dynamic(
  () =>
    import('./MPPoseDetection').then((mod) => ({
      default: mod.MPPoseDetection,
    })),
  { ssr: false }
)

export { MPPoseDetection }
