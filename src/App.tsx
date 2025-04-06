import { useEffect } from 'react'
import { EditorUIProvider } from './contexts/EditorUIContext'
import { ResumeDataProvider, useResumeData } from './contexts/ResumeDataContext'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import { fileService } from './services/fileService'
import { useAutoSave } from './hooks/useAutoSave'
import './App.css'

function App() {
  const { data, saveDirectory, setSaveDirectory, setLastSaved } = useResumeData()

  useEffect(() => {
    const loadAutoSaveDirectory = async () => {
      try {
        const handle = await fileService.getAutoSaveDirectory()
        setSaveDirectory(handle)
      } catch (err) {
        console.error('자동 저장 디렉토리를 불러오는데 실패했습니다:', err)
      }
    }
    loadAutoSaveDirectory()
  }, [setSaveDirectory])

  useAutoSave(data, saveDirectory, {
    onSave: () => setLastSaved(new Date()),
    onError: (err) => console.error('자동 저장 중 오류가 발생했습니다:', err),
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeHeader />
      <ResumeEditor />
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
