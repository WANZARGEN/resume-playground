import { useEffect } from 'react'
import { ResumeProvider, useResume } from './contexts/ResumeContext'
import ResumeEditor from './components/ResumeEditor'
import ResumeHeader from './components/ResumeHeader'
import { convertResumeToHtml } from './utils/htmlConverter'
import { Resume } from './types/resume'
import './App.css'

function App() {
  const { editData, setEditData, saveDirectory, setSaveDirectory } = useResume()

  useEffect(() => {
    const loadAutoSaveDirectory = async () => {
      try {
        const handle = await navigator.storage.getDirectory()
        setSaveDirectory(handle)
      } catch (err) {
        console.error('자동 저장 디렉토리를 불러오는데 실패했습니다:', err)
      }
    }
    loadAutoSaveDirectory()
  }, [setSaveDirectory])

  const handleDownload = async (data: Resume, format: 'json' | 'html') => {
    try {
      const blob = format === 'json'
        ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        : new Blob([await convertResumeToHtml(data)], { type: 'text/html' })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('다운로드 중 오류가 발생했습니다:', err)
    }
  }

  const handleSave = async (data: Resume, directory: FileSystemDirectoryHandle) => {
    try {
      const fileHandle = await directory.getFileHandle('resume.json', { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(data, null, 2))
      await writable.close()
      console.log('저장 완료')
    } catch (err) {
      console.error('저장 중 오류가 발생했습니다:', err)
    }
  }

  const handleLoad = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: {
              'application/json': ['.json'],
            },
          },
        ],
      })
      const file = await fileHandle.getFile()
      const content = await file.text()
      const data = JSON.parse(content)
      setEditData(data)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('파일을 불러오는 중 오류가 발생했습니다:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ResumeHeader
        onDownload={handleDownload}
        onSave={handleSave}
        onLoad={handleLoad}
      />
      <ResumeEditor />
    </div>
  )
}

function AppWithProvider() {
  return (
    <ResumeProvider>
      <App />
    </ResumeProvider>
  )
}

export default AppWithProvider
