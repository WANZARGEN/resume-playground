import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Resume } from '../types/resume'

// 초기 데이터
const initialData: Resume = {
  profile: {
    photo: '',
    name: '',
    position: '',
    contacts: [],
    introduction: '',
  },
  employments: [],
  education: [],
}

type ResumeFormat = {
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

interface ResumeContextType {
  activeTab: 'edit' | 'preview'
  setActiveTab: (tab: 'edit' | 'preview') => void
  editData: Resume
  setEditData: (data: Resume) => void
  saveDirectory: FileSystemDirectoryHandle | null
  setSaveDirectory: (directory: FileSystemDirectoryHandle | null) => void
  selectedFormat: ResumeFormat
  setSelectedFormat: (format: ResumeFormat) => void
}

const ResumeContext = createContext<ResumeContextType | null>(null)

interface Props {
  children: ReactNode
}

export function ResumeProvider({ children }: Props) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [editData, setEditData] = useState<Resume>(initialData)
  const [saveDirectory, setSaveDirectory] = useState<FileSystemDirectoryHandle | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormat>(resumeFormats[0])

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

export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
} 