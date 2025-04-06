import { EditorUIProvider } from './contexts/EditorUIContext'
import { FileProvider } from './contexts/FileContext'
import { ResumeDataProvider } from './contexts/ResumeDataContext'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import './App.css'

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeHeader />
      <main className="max-w-[2400px] mx-auto p-8">
        <ResumeEditor />
      </main>
    </div>
  )
}

function App() {
  return (
    <EditorUIProvider>
      <FileProvider>
        <ResumeDataProvider>
          <AppContent />
        </ResumeDataProvider>
      </FileProvider>
    </EditorUIProvider>
  )
}

export default App
