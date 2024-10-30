import dynamic from 'next/dynamic'

const WebcamView = dynamic(
  () => import('./WebcamView').then((mod) => mod.WebcamView),
  { ssr: false }
)

export { WebcamView }
