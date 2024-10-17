'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Label } from '@/app/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'

export function Settings() {
  const [similarityMethod, setSimilarityMethod] = useState('cosine')
  const [coordinateSystem, setCoordinateSystem] = useState('default')

  return (
    <Card className="h-full">
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
              <SelectItem value="cosine">Cosine</SelectItem>
              <SelectItem value="oks">OKS</SelectItem>
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
