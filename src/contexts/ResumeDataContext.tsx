import React, { createContext, useContext, useState, useEffect } from 'react'
import { Resume } from '../types/resume'
import frontendResume from '../data/frontend-resume.json'
import backendResume from '../data/backend-resume.json'
import { InitialDataModal } from '../components/modals/InitialDataModal'

const STORAGE_KEY = 'resume-data'
const LAST_PATH_KEY = 'last-resume-path'

const emptyResume: Resume = {
  profile: {
    photo: '',
    name: '',
    position: '',
    contacts: [],
    paragraphs: [],
  },
  employments: [],
  education: [],
}

interface ResumeDataContextType {
  data: Resume
  setData: (data: Resume) => void
  filePath: string | null
  setFilePath: (path: string | null) => void
}

const ResumeDataContext = createContext<ResumeDataContextType | undefined>(undefined)

export function ResumeDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Resume>(emptyResume)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [showInitialModal, setShowInitialModal] = useState(false)

  useEffect(() => {
    const lastPath = localStorage.getItem(LAST_PATH_KEY)
    const savedData = localStorage.getItem(STORAGE_KEY)

    if (!lastPath && !savedData) {
      setShowInitialModal(true)
    } else if (savedData) {
      try {
        setData(JSON.parse(savedData))
      } catch (e) {
        console.error('Failed to parse saved data:', e)
        setShowInitialModal(true)
      }
    }
  }, [])

  useEffect(() => {
    if (data !== emptyResume) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  useEffect(() => {
    if (filePath) {
      localStorage.setItem(LAST_PATH_KEY, filePath)
    }
  }, [filePath])

  const handleSelectFrontend = () => {
    setData(frontendResume as Resume)
    setShowInitialModal(false)
  }

  const handleSelectBackend = () => {
    setData(backendResume as Resume)
    setShowInitialModal(false)
  }

  const handleSelectEmpty = () => {
    setData(emptyResume)
    setShowInitialModal(false)
  }

  return (
    <ResumeDataContext.Provider value={{ data, setData, filePath, setFilePath }}>
      {children}
      <InitialDataModal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        onSelectFrontend={handleSelectFrontend}
        onSelectBackend={handleSelectBackend}
        onSelectEmpty={handleSelectEmpty}
      />
    </ResumeDataContext.Provider>
  )
}

export function useResumeData() {
  const context = useContext(ResumeDataContext)
  if (context === undefined) {
    throw new Error('useResumeData must be used within a ResumeDataProvider')
  }
  return context
} 