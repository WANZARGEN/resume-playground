import { EditorUIProvider } from './contexts/EditorUIContext'
import { FileProvider } from './contexts/FileContext'
import { ResumeDataProvider } from './contexts/ResumeDataContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import { useState } from 'react'
import { ApiKeyDialog } from './components/common/ApiKeyDialog'
import { ErrorBoundary } from './components/ErrorBoundary'
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
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <div className="flex-shrink-0">
        <ResumeHeader />
      </div>
      <main className="flex-1 overflow-hidden">
        <ResumeEditor />
      </main>
      <ApiKeyDialog
        isOpen={isApiKeyDialogOpen}
        onClose={() => setIsApiKeyDialogOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <EditorUIProvider>
          <FileProvider>
            <ResumeDataProvider>
              <ErrorBoundary>
                <AppContent />
              </ErrorBoundary>
            </ResumeDataProvider>
          </FileProvider>
        </EditorUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
