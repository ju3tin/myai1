'use client'

import { Dispatch, SetStateAction } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'

interface SettingsProps {
  similarityMethod: string
  setSimilarityMethod: Dispatch<SetStateAction<string>>
  coordinateSystem: string
  setCoordinateSystem: Dispatch<SetStateAction<string>>
}

export function Settings({
  similarityMethod,
  setSimilarityMethod,
  coordinateSystem,
  setCoordinateSystem,
}: SettingsProps) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
          <Label htmlFor="similarity-method">Similarity Method:</Label>
          <Select value={similarityMethod} onValueChange={setSimilarityMethod}>
            <SelectTrigger id="similarity-method" className="w-full">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cosineDistance">Cosine Distance</SelectItem>
              <SelectItem value="weightedDistance">
                Weighted Distance
              </SelectItem>
              <SelectItem value="cosineSimilarity">
                Cosine Similarity
              </SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="coordinate-system">Coordinate System:</Label>
          <Select value={coordinateSystem} onValueChange={setCoordinateSystem}>
            <SelectTrigger id="coordinate-system" className="w-full">
              <SelectValue placeholder="Select origin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="neck">Neck Center</SelectItem>
              <SelectItem value="hip">Hip Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
