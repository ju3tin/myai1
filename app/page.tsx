'use client'

import { MNProvider } from '@/app/contexts/mn-context'
import { ExerciseView } from '@/app/components/pose-detection/ExerciseView'

export default function Home() {
  return (
    <MNProvider>
      <ExerciseView />
    </MNProvider>
  )
}
