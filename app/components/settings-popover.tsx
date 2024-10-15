'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export interface SettingData {
  model: string
  modelVariant: string
  runtime: string
}

interface SettingsPopoverProps {
  onSettingsChange: (settings: SettingData) => void
}

export function SettingsPopover({ onSettingsChange }: SettingsPopoverProps) {
  const [model, setModel] = useState('MoveNet')
  const [modelVariant, setModelVariant] = useState('lightning')
  const [runtime, setRuntime] = useState('tfjs-webgl')

  const handleSettingsChange = () => {
    onSettingsChange({ model, modelVariant, runtime })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure model and runtime settings.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="model">Model</label>
              <Select
                value={model}
                onValueChange={(value) => {
                  setModel(value)
                  setModelVariant(value === 'MoveNet' ? 'lightning' : 'lite')
                  setRuntime(value === 'MoveNet' ? 'tfjs-webgl' : 'tfjs-webgpu')
                  handleSettingsChange()
                }}
              >
                <SelectTrigger className="col-span-2 h-8">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MoveNet">MoveNet</SelectItem>
                  <SelectItem value="BlazePose">BlazePose</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="variant">Variant</label>
              <Select
                value={modelVariant}
                onValueChange={(value) => {
                  setModelVariant(value)
                  handleSettingsChange()
                }}
              >
                <SelectTrigger className="col-span-2 h-8">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {model === 'MoveNet' ? (
                    <>
                      <SelectItem value="lightning">Lightning</SelectItem>
                      <SelectItem value="thunder">Thunder</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="lite">Lite</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="runtime">Runtime</label>
              <Select
                value={runtime}
                onValueChange={(value) => {
                  setRuntime(value)
                  handleSettingsChange()
                }}
              >
                <SelectTrigger className="col-span-2 h-8">
                  <SelectValue placeholder="Select runtime" />
                </SelectTrigger>
                <SelectContent>
                  {model === 'MoveNet' ? (
                    <>
                      <SelectItem value="tfjs-webgl">WebGL</SelectItem>
                      <SelectItem value="tfjs-webgpu">WebGPU</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="tfjs-webgpu">WebGPU</SelectItem>
                      <SelectItem value="tfjs-webgl">WebGL</SelectItem>
                      <SelectItem value="mediapipe-gpu">
                        MediaPipe GPU
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
