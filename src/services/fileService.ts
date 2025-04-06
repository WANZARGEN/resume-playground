import { Resume } from '../types/resume'
import { convertResumeToHtml } from '../utils/htmlConverter'

export class FileService {
  async saveToDirectory(data: Resume, directory: FileSystemDirectoryHandle): Promise<void> {
    try {
      const fileHandle = await directory.getFileHandle('resume.json', { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(data, null, 2))
      await writable.close()
    } catch (err) {
      console.error('저장 중 오류가 발생했습니다:', err)
      throw err
    }
  }

  async loadFromFile(): Promise<Resume> {
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
      return JSON.parse(content)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('파일을 불러오는 중 오류가 발생했습니다:', err)
      }
      throw err
    }
  }

  async downloadAs(data: Resume, format: 'json' | 'html'): Promise<void> {
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
      throw err
    }
  }

  async getAutoSaveDirectory(): Promise<FileSystemDirectoryHandle> {
    try {
      return await navigator.storage.getDirectory()
    } catch (err) {
      console.error('자동 저장 디렉토리를 불러오는데 실패했습니다:', err)
      throw err
    }
  }
}

export const fileService = new FileService() 