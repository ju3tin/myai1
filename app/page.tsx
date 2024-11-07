'use client'

import { ExerciseView } from '@/app/components/pose-detection/ExerciseView'
import { MNProvider } from '@/app/contexts/mn-context'

export default function Home() {
  return (
    <MNProvider>
      <ExerciseView />
    </MNProvider>
  )
}
