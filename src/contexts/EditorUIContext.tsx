import React, { createContext, useContext, useState } from 'react'
import { Resume } from '../types/resume'

export type ViewMode = 'edit-only' | 'split' | 'preview-only'
export type ResumeFormat = { id: 'json' | 'html' | 'pdf'; name: string }

export type EditorUIContextType = {
  activeTab: ViewMode
  setActiveTab: (tab: ViewMode) => void
  selectedFormat: ResumeFormat
  setSelectedFormat: (format: ResumeFormat) => void
  lastSavedData: Resume | null
  setLastSavedData: (data: Resume | null) => void
  saveDirectory: string | null
  setSaveDirectory: (path: string | null) => void
}

export const resumeFormats: ResumeFormat[] = [
  { id: 'html', name: 'HTML' },
  { id: 'pdf', name: 'PDF' },
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
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>(resumeFormats[0])
  const [lastSavedData, setLastSavedData] = useState<Resume | null>(null)
  const [saveDirectory, setSaveDirectory] = useState<string | null>(null)

  return (
    <EditorUIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedFormat,
        setSelectedFormat,
        lastSavedData,
        setLastSavedData,
        saveDirectory,
        setSaveDirectory
      }}
    >
      {children}
    </EditorUIContext.Provider>
  )
} 