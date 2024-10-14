import Image from 'next/image'
import { memo } from 'react'

export const TargetPoseImage = memo(function TargetPoseImage() {
  return (
    <div className="relative w-full aspect-video bg-gray-100 flex items-center justify-center">
      <Image
        src="/placeholder-pose.avif"
        alt="Target pose"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'contain' }}
        priority
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextElementSibling?.classList.remove('hidden')
        }}
      />
      <p className="text-gray-500 hidden">No target pose image available</p>
    </div>
  )
})
