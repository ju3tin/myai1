import dynamic from 'next/dynamic'

const PoseDetection3D = dynamic(
  () =>
    import('./PoseDetection3D').then((mod) => ({
      default: mod.PoseDetection3D,
    })),
  { ssr: false }
)

export { PoseDetection3D }
