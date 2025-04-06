import { useEffect } from 'react'
import { EditorUIProvider } from './contexts/EditorUIContext'
import { FileProvider } from './contexts/FileContext'
import { ResumeDataProvider, useResumeData } from './contexts/ResumeDataContext'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
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
      <FileProvider>
        <ResumeDataProvider>
          <App />
        </ResumeDataProvider>
      </FileProvider>
    </EditorUIProvider>
  )
}

export default AppWithProviders
