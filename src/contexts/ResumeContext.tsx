import { createContext, useContext, ReactNode, useState } from 'react'
import { Resume } from '../types/resume'

interface ResumeContextType {
  activeTab: 'edit' | 'preview'
  setActiveTab: (tab: 'edit' | 'preview') => void
  editData: Resume
  setEditData: (data: Resume) => void
  saveDirectory: FileSystemDirectoryHandle | null
  setSaveDirectory: (directory: FileSystemDirectoryHandle | null) => void
  selectedFormat: { id: 'json' | 'html'; name: string; description: string }
  setSelectedFormat: (format: { id: 'json' | 'html'; name: string; description: string }) => void
}

const ResumeContext = createContext<ResumeContextType | null>(null)

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}

interface Props {
  children: ReactNode
  initialData: Resume
  autoSaveDirectory: FileSystemDirectoryHandle | null
}

const formats = [
  { id: 'json' as const, name: 'JSON 형식', description: '나중에 불러오기 가능' },
  { id: 'html' as const, name: 'HTML 형식', description: '웹 브라우저에서 보기' },
]

export function ResumeProvider({ children, initialData, autoSaveDirectory }: Props) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [editData, setEditData] = useState<Resume>(initialData)
  const [selectedFormat, setSelectedFormat] = useState(formats[0])
  const [saveDirectory, setSaveDirectory] = useState<FileSystemDirectoryHandle | null>(autoSaveDirectory)

  return (
    <ResumeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        editData,
        setEditData,
        saveDirectory,
        setSaveDirectory,
        selectedFormat,
        setSelectedFormat,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}

export const resumeFormats = formats 