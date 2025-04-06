import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ViewMode = 'edit-only' | 'split' | 'preview-only'

export type ResumeFormat = {
  id: 'json' | 'html'
  name: string
  description: string
}

export const resumeFormats: ResumeFormat[] = [
  {
    id: 'json',
    name: 'JSON',
    description: '데이터 형식으로 저장',
  },
  {
    id: 'html',
    name: 'HTML',
    description: '웹 페이지 형식으로 저장',
  },
]

interface EditorUIContextType {
  activeTab: ViewMode
  setActiveTab: (tab: ViewMode) => void
  selectedFormat: ResumeFormat
  setSelectedFormat: (format: ResumeFormat) => void
}

const EditorUIContext = createContext<EditorUIContextType | null>(null)

interface Props {
  children: ReactNode
}

export function EditorUIProvider({ children }: Props) {
  const [activeTab, setActiveTab] = useState<ViewMode>('split')
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>(resumeFormats[0])

  return (
    <EditorUIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedFormat,
        setSelectedFormat,
      }}
    >
      {children}
    </EditorUIContext.Provider>
  )
}

export function useEditorUI() {
  const context = useContext(EditorUIContext)
  if (!context) {
    throw new Error('useEditorUI must be used within an EditorUIProvider')
  }
  return context
} 