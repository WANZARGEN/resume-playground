import { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Resume } from './types/resume'
import ResumeEditor from './components/ResumeEditor'
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

  const generateHtml = (data: Resume): string => {
    return `
      <!DOCTYPE html>
      <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>이력서 - ${data.profile.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 2cm;
              }
            }
          </style>
        </head>
        <body>
          <div id="resume">
            <!-- 프로필 -->
            <div class="mb-8">
              <div class="flex items-center gap-6 mb-4">
                ${
                  data.profile.photo
                    ? `<img src="${data.profile.photo}" alt="Profile" class="w-32 h-32 rounded-full object-cover">`
                    : ''
                }
                <div>
                  <h1 class="text-3xl font-bold">${data.profile.name}</h1>
                  <p class="text-xl text-gray-600">${data.profile.position}</p>
                </div>
              </div>
              <div class="space-y-2">
                ${data.profile.contacts
                  .map(
                    (contact) => `
                  <p>
                    <span class="font-medium">${contact.type}:</span>
                    <a href="${
                      contact.type === 'email'
                        ? `mailto:${contact.value}`
                        : contact.value
                    }" class="text-blue-600 hover:underline">${contact.value}</a>
                  </p>
                `
                  )
                  .join('')}
              </div>
              ${
                data.profile.introduction
                  ? `<p class="mt-4 text-gray-700">${data.profile.introduction}</p>`
                  : ''
              }
            </div>

            <!-- 경력 -->
            ${
              data.employments.length > 0
                ? `
              <div class="mb-8">
                <h2 class="text-2xl font-bold mb-4">경력</h2>
                ${data.employments
                  .map(
                    (employment) => `
                  <div class="mb-6">
                    <div class="flex justify-between items-baseline mb-2">
                      <h3 class="text-xl font-semibold">${employment.company}</h3>
                      <span class="text-gray-600">${employment.period.start} - ${
                      employment.period.end
                    }</span>
                    </div>
                    <p class="text-lg text-gray-700 mb-2">${employment.position}</p>
                    ${
                      employment.techStack.length > 0
                        ? `
                      <div class="mb-2">
                        <h4 class="font-medium mb-1">기술 스택</h4>
                        <div class="flex flex-wrap gap-2">
                          ${employment.techStack
                            .map(
                              (tech) => `
                            <span class="px-2 py-1 bg-gray-100 rounded-md text-sm">${tech.name}</span>
                          `
                            )
                            .join('')}
                        </div>
                      </div>
                    `
                        : ''
                    }
                    ${
                      employment.details.length > 0
                        ? `
                      <div>
                        <h4 class="font-medium mb-1">주요 업무</h4>
                        <ul class="list-disc list-inside space-y-1">
                          ${employment.details
                            .map(
                              (detail) => `
                            <li>
                              <span class="font-medium">${detail.title}</span>
                              ${
                                detail.description
                                  ? ` - ${detail.description}`
                                  : ''
                              }
                            </li>
                          `
                            )
                            .join('')}
                        </ul>
                      </div>
                    `
                        : ''
                    }
                  </div>
                `
                  )
                  .join('')}
              </div>
            `
                : ''
            }

            <!-- 교육 및 활동 -->
            ${
              data.education.length > 0
                ? `
              <div>
                <h2 class="text-2xl font-bold mb-4">교육 및 활동</h2>
                <div class="space-y-6">
                  ${data.education
                    .map(
                      (item) => `
                    <div>
                      <h3 class="text-lg font-semibold">${item.title}</h3>
                      ${
                        item.url
                          ? `<a href="${item.url}" class="text-blue-600 hover:underline">${item.url}</a>`
                          : ''
                      }
                      ${
                        item.description
                          ? `<p class="text-gray-700 mt-1">${item.description}</p>`
                          : ''
                      }
                      ${
                        item.activities && item.activities.length > 0
                          ? `
                        <ul class="mt-2 list-disc list-inside space-y-1">
                          ${item.activities
                            .map(
                              (activity) => `
                            <li>${activity.title}${
                                activity.description
                                  ? ` - ${activity.description}`
                                  : ''
                              }</li>
                          `
                            )
                            .join('')}
                        </ul>
                      `
                          : ''
                      }
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            `
                : ''
            }
          </div>
        </body>
      </html>
    `
  }

  const handleDownload = async (newData: Resume, format: 'json' | 'html') => {
    try {
      setData(newData)
  
      const content =
        format === 'json'
          ? JSON.stringify(newData, null, 2)
          : generateHtml(newData)
  
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
