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
}

const ResumeDataContext = createContext<ResumeDataContextType | null>(null)

interface Props {
  children: ReactNode
}

export function ResumeDataProvider({ children }: Props) {
  const [data, setData] = useState<Resume>(initialData)

  return (
    <ResumeDataContext.Provider
      value={{
        data,
        setData,
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