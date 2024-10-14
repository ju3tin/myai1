import dynamic from 'next/dynamic'

const ExerciseView = dynamic(() => import('@/app/components/ExerciseView'), {
  ssr: false,
})

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to RehabMotion</h1>
      <ExerciseView />
    </div>
  )
}
