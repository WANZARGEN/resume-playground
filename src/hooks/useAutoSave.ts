import { useEffect, useRef } from 'react'
import { Resume } from '../types/resume'
import { fileService } from '../services/fileService'
import toast from 'react-hot-toast'
import { useEditorUI } from '../contexts/EditorUIContext'

export const useAutoSave = (data: Resume) => {
  const { saveDirectory, lastSavedData, setLastSavedData } = useEditorUI()
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const autoSave = async () => {
      if (!saveDirectory) return
      
      // 마지막 저장 데이터와 현재 데이터를 비교
      if (JSON.stringify(lastSavedData) !== JSON.stringify(data)) {
        try {
          await fileService.saveToDirectory(data, saveDirectory)
          setLastSavedData(data)
          toast.success('자동 저장되었습니다.')
        } catch (err) {
          console.error('자동 저장 중 오류가 발생했습니다:', err)
          toast.error('자동 저장에 실패했습니다.')
        }
      }
    }

    // 이전 타이머 제거
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current)
    }

    // 저장 경로가 있는 경우에만 자동 저장 타이머 설정
    if (saveDirectory) {
      autoSaveTimerRef.current = setInterval(autoSave, 5000) // 5초마다 실행
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [data, saveDirectory, lastSavedData, setLastSavedData])
} 