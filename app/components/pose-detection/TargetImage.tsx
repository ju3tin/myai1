import Image from 'next/image'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export function TargetImage() {
  return (
    <Card className="h-[calc(50vh-2rem)]">
      <CardHeader>
        <CardTitle>Target Pose</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[calc(100%-4rem)]">
        <Image
          src="/placeholder-pose.avif"
          alt="Target pose"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-contain"
        />
      </CardContent>
    </Card>
  )
}
