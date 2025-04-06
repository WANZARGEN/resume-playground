import { useEffect, useRef } from 'react'
import { Resume } from '../types/resume'
import { fileService } from '../services/fileService'

interface AutoSaveOptions {
  interval?: number
  onSave?: () => void
  onError?: (error: Error) => void
}

export function useAutoSave(
  data: Resume,
  directory: FileSystemDirectoryHandle | null,
  options: AutoSaveOptions = {}
) {
  const {
    interval = 5000,
    onSave,
    onError,
  } = options

  const lastSavedDataRef = useRef<string>('')

  useEffect(() => {
    if (!directory) return

    const intervalId = setInterval(async () => {
      const currentData = JSON.stringify(data, null, 2)
      const lastSavedData = lastSavedDataRef.current

      if (!lastSavedData || currentData !== lastSavedData) {
        try {
          await fileService.saveToDirectory(data, directory)
          lastSavedDataRef.current = currentData
          onSave?.()
        } catch (err) {
          onError?.(err as Error)
        }
      }
    }, interval)

    return () => clearInterval(intervalId)
  }, [data, directory, interval, onSave, onError])
} 