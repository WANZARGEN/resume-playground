import { useEffect, useRef } from 'react'
import { Resume } from '../types/resume'
import toast from 'react-hot-toast'
import { useEditorUI } from '../contexts/EditorUIContext'
import { fileService } from '../services/fileService'

export const useAutoSave = (data: Resume) => {
  const { lastSavedData, setLastSavedData } = useEditorUI()
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const lastHandle = fileService.getLastSavedHandle()
    
    // 데이터가 변경되지 않았거나 초기 상태면 저장하지 않음
    if (!lastSavedData || data === lastSavedData) return

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        // 파일 핸들이 없으면 저장 알림
        if (!lastHandle) {
          toast.loading('수정된 내용을 저장하려면 파일을 선택해주세요.', {
            duration: 3000
          })
          return
        }

        await fileService.saveToFile(data, lastHandle)
        setLastSavedData(data)
        toast.success('자동 저장되었습니다.')
      } catch (err) {
        console.error('자동 저장 중 오류가 발생했습니다:', err)
        toast.error('자동 저장에 실패했습니다.')
      }
    }, 5000)

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [data, lastSavedData, setLastSavedData])
} 