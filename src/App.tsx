import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Resume } from './types/resume'
import ResumeEditor from './components/ResumeEditor'
import { convertResumeToHtml } from './utils/htmlConverter'
import './App.css'

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

function App() {
  const [data, setData] = useState<Resume>(initialData)
  const [autoSaveDirectory, setAutoSaveDirectory] = useState<FileSystemDirectoryHandle | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastSavedDataRef = useRef<string>('')

  useEffect(() => {
    if (!autoSaveDirectory) return

    // 디렉토리 ID 저장
    const saveDirectoryId = async () => {
      try {
        const id = (autoSaveDirectory as any).id
        if (id) {
          localStorage.setItem('autoSaveDirectoryId', id)
        }
      } catch (error) {
        console.error('Failed to save directory ID:', error)
      }
    }

    saveDirectoryId()

    const interval = setInterval(async () => {
      // 현재 데이터를 문자열로 변환 (들여쓰기 포함)
      const currentData = JSON.stringify(data, null, 2)
      const lastSavedData = lastSavedDataRef.current

      // 데이터가 다른 경우에만 저장
      if (!lastSavedData || currentData !== lastSavedData) {
        console.log('변경사항 감지됨, 저장 시작...')
        try {
          const blob = new Blob([currentData], { type: 'application/json' })
          const fileHandle = await autoSaveDirectory.getFileHandle('resume.json', { create: true })
          const writable = await fileHandle.createWritable()
          await writable.write(blob)
          await writable.close()
          lastSavedDataRef.current = currentData
          toast.success('자동 저장되었습니다.')
        } catch (error) {
          console.error('Failed to auto-save resume:', error)
          toast.error('자동 저장에 실패했습니다.')
        }
      }
    }, 5000) // 5초마다 실행

    return () => clearInterval(interval)
  }, [data, autoSaveDirectory])

  const handleDownload = async (newData: Resume, format: 'json' | 'html') => {
    try {
      setData(newData)
  
      const content =
        format === 'json'
          ? JSON.stringify(newData, null, 2)
          : convertResumeToHtml(newData)
  
      const blob = new Blob(
        [content],
        { type: format === 'json' ? 'application/json' : 'text/html' }
      )
  
      if ('showSaveFilePicker' in window) {
        const opts = {
          suggestedName: `resume.${format}`,
          types: [
            {
              description: format === 'json' ? 'JSON file' : 'HTML file',
              accept: {
                [format === 'json' ? 'application/json' : 'text/html']: [`.${format}`],
              },
            },
          ],
        }
  
        try {
          const handle = await (window as any).showSaveFilePicker(opts)
          const writable = await handle.createWritable()
          await writable.write(blob)
          await writable.close()
          toast.success('이력서가 다운로드되었습니다.')
        } catch (pickerError: any) {
          if (pickerError.name === 'AbortError') {
            // 사용자가 취소한 경우는 무시
            return
          }
          throw pickerError
        }
  
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `resume.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
  
        toast.success('이력서가 다운로드되었습니다.')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      toast.error('이력서 다운로드에 실패했습니다.')
    }
  }

  const handleSave = async (newData: Resume, directory: FileSystemDirectoryHandle) => {
    try {
      setData(newData)
      setAutoSaveDirectory(directory)

      console.log('디렉토리 정보:', {
        name: directory.name,
        kind: directory.kind,
      })

      // JSON 형식으로 저장
      const content = JSON.stringify(newData, null, 2)
      const blob = new Blob([content], { type: 'application/json' })
      lastSavedDataRef.current = content

      const fileHandle = await directory.getFileHandle('resume.json', { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(blob)
      await writable.close()
      toast.success('이력서가 저장되었습니다.')
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      console.error('디렉토리 저장 중 오류:', err)
      toast.error('디렉토리 접근에 실패했습니다.')
    }
  }

  const handleLoad = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const newData = JSON.parse(content) as Resume
      setData(newData)
      toast.success('이력서를 불러왔습니다.')
    } catch (error) {
      console.error('Failed to load resume:', error)
      toast.error('이력서 불러오기에 실패했습니다.\nJSON 파일 형식이 올바른지 확인해주세요.')
    }

    // 파일 입력 초기화
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <ResumeEditor
        data={data}
        onDownload={handleDownload}
        onSave={handleSave}
        onLoad={handleLoad}
        autoSaveDirectory={autoSaveDirectory}
      />
    </div>
  )
}

export default App
