import { ExerciseView } from '@/app/components/ExerciseView'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to RehabMotion</h1>
      <ExerciseView />
    </div>
  )
}
