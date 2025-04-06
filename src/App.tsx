import { useEffect } from 'react'
import { EditorUIProvider } from './contexts/EditorUIContext'
import { ResumeDataProvider, useResumeData } from './contexts/ResumeDataContext'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import { fileService } from './services/fileService'
import { useAutoSave } from './hooks/useAutoSave'
import './App.css'

function App() {
  const { data } = useResumeData()
  useAutoSave(data)

  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeHeader />
      <main className="max-w-[2400px] mx-auto p-8">
        <ResumeEditor />
      </main>
    </div>
  )
}

function AppWithProviders() {
  return (
    <EditorUIProvider>
      <ResumeDataProvider>
        <App />
      </ResumeDataProvider>
    </EditorUIProvider>
  )
}

export default AppWithProviders
