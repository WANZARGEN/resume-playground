import { EditorUIProvider } from './contexts/EditorUIContext'
import { FileProvider } from './contexts/FileContext'
import { ResumeDataProvider } from './contexts/ResumeDataContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import './App.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})

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
    <QueryClientProvider client={queryClient}>
      <EditorUIProvider>
        <FileProvider>
          <ResumeDataProvider>
            <AppContent />
          </ResumeDataProvider>
        </FileProvider>
      </EditorUIProvider>
    </QueryClientProvider>
  )
}

export default App
