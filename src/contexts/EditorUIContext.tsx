import React, { createContext, useContext, useState } from 'react'
import { Resume } from '../types/resume'
import { fileService } from '../services/fileService'
import toast from 'react-hot-toast'

export type ViewMode = 'edit-only' | 'split' | 'preview-only'
export type ResumeFormat = { id: 'json' | 'html'; name: string }

export interface EditorUIContextType {
  activeTab: ViewMode
  setActiveTab: (tab: ViewMode) => void
  saveDirectory: FileSystemDirectoryHandle | null
  setSaveDirectory: (directory: FileSystemDirectoryHandle | null) => void
  selectedFormat: ResumeFormat
  setSelectedFormat: (format: ResumeFormat) => void
  lastSavedData: Resume | null
  setLastSavedData: (data: Resume | null) => void
}

export const resumeFormats: ResumeFormat[] = [
  { id: 'html', name: 'HTML' },
  { id: 'json', name: 'JSON' }
]

const EditorUIContext = createContext<EditorUIContextType | null>(null)

export const useEditorUI = () => {
  const context = useContext(EditorUIContext)
  if (!context) {
    throw new Error('useEditorUI must be used within an EditorUIProvider')
  }
  return context
}

export const EditorUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ViewMode>('split')
  const [saveDirectory, setSaveDirectory] = useState<FileSystemDirectoryHandle | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>(resumeFormats[0])
  const [lastSavedData, setLastSavedData] = useState<Resume | null>(null)

  return (
    <EditorUIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        saveDirectory,
        setSaveDirectory,
        selectedFormat,
        setSelectedFormat,
        lastSavedData,
        setLastSavedData
      }}
    >
      {children}
    </EditorUIContext.Provider>
  )
} 