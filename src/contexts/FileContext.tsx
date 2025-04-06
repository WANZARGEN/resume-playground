import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Resume } from '../types/resume'
import { fileService } from '../services/fileService'
import toast from 'react-hot-toast'

interface FileContextType {
  saveDirectory: FileSystemDirectoryHandle | null
  setSaveDirectory: (directory: FileSystemDirectoryHandle | null) => void
  lastSaved: Date | null
  setLastSaved: (date: Date | null) => void
  getLastSavedPath: () => string | null
  clearLastSavedPath: () => void
  getLastSavedFileName: () => string | null
  getLastSavedHandle: () => FileSystemFileHandle | null
  saveFile: (data: Resume) => Promise<void>
  loadFile: (showPicker?: boolean) => Promise<Resume>
  downloadFile: (data: Resume, format: 'json' | 'html') => Promise<void>
}

const FileContext = createContext<FileContextType | null>(null)

interface Props {
  children: ReactNode
}

export function FileProvider({ children }: Props) {
  const [saveDirectory, setSaveDirectory] = useState<FileSystemDirectoryHandle | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const saveFile = async (data: Resume) => {
    try {
      const lastHandle = fileService.getLastSavedHandle()
      if (!lastHandle) {
        toast.error('먼저 저장할 파일을 선택해주세요.')
        return
      }
      await fileService.saveToFile(data, lastHandle)
      setLastSaved(new Date())
      toast.success('이력서가 저장되었습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('저장 중 오류가 발생했습니다:', err)
        toast.error('저장에 실패했습니다.')
      }
      throw err
    }
  }

  const loadFile = async (showPicker: boolean = false) => {
    try {
      const data = await fileService.loadFile(showPicker)
      toast.success('이력서를 불러왔습니다.')
      return data
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw err
      }
      console.error('파일을 불러오는 중 오류가 발생했습니다:', err)
      toast.error('파일을 불러오는데 실패했습니다.')
      throw err
    }
  }

  const downloadFile = async (data: Resume, format: 'json' | 'html') => {
    try {
      await fileService.downloadAs(data, format)
      toast.success('이력서가 다운로드되었습니다.')
    } catch (err) {
      console.error('다운로드 중 오류가 발생했습니다:', err)
      toast.error('다운로드에 실패했습니다.')
      throw err
    }
  }

  return (
    <FileContext.Provider
      value={{
        saveDirectory,
        setSaveDirectory,
        lastSaved,
        setLastSaved,
        getLastSavedPath: fileService.getLastSavedPath,
        clearLastSavedPath: fileService.clearLastSavedPath,
        getLastSavedFileName: fileService.getLastSavedFileName,
        getLastSavedHandle: fileService.getLastSavedHandle,
        saveFile,
        loadFile,
        downloadFile,
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export function useFile() {
  const context = useContext(FileContext)
  if (!context) {
    throw new Error('useFile must be used within a FileProvider')
  }
  return context
} 