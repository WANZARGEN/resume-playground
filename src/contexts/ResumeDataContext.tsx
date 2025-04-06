import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react'
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

interface ResumeDataContextType {
  data: Resume
  setData: Dispatch<SetStateAction<Resume>>
  saveDirectory: FileSystemDirectoryHandle | null
  setSaveDirectory: (directory: FileSystemDirectoryHandle | null) => void
  lastSaved: Date | null
  setLastSaved: (date: Date | null) => void
}

const ResumeDataContext = createContext<ResumeDataContextType | null>(null)

interface Props {
  children: ReactNode
}

export function ResumeDataProvider({ children }: Props) {
  const [data, setData] = useState<Resume>(initialData)
  const [saveDirectory, setSaveDirectory] = useState<FileSystemDirectoryHandle | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  return (
    <ResumeDataContext.Provider
      value={{
        data,
        setData,
        saveDirectory,
        setSaveDirectory,
        lastSaved,
        setLastSaved,
      }}
    >
      {children}
    </ResumeDataContext.Provider>
  )
}

export function useResumeData() {
  const context = useContext(ResumeDataContext)
  if (!context) {
    throw new Error('useResumeData must be used within a ResumeDataProvider')
  }
  return context
} 