import { Resume } from '../types/resume'
import { convertResumeToHtml } from '../utils/htmlConverter'

const LAST_SAVED_PATH_KEY = 'lastSavedPath'

export class FileService {
  private lastSavedHandle: FileSystemFileHandle | null = null

  constructor() {
    // 마지막 저장 경로가 있으면 자동으로 파일 핸들 설정
    const lastPath = this.getLastSavedPath()
    if (lastPath) {
      this.selectSaveFile().catch(() => {
        // 파일 핸들 설정 실패 시 무시
      })
    }
  }

  private saveLastPath(path: string) {
    localStorage.setItem(LAST_SAVED_PATH_KEY, path)
  }

  clearLastSavedPath() {
    localStorage.removeItem(LAST_SAVED_PATH_KEY)
    this.lastSavedHandle = null
  }

  getLastSavedPath(): string | null {
    return localStorage.getItem(LAST_SAVED_PATH_KEY)
  }

  async readLastSavedFile(): Promise<Resume | null> {
    const lastPath = this.getLastSavedPath()
    if (!lastPath) return null

    try {
      const response = await fetch(lastPath)
      if (!response.ok) return null
      return await response.json() as Resume
    } catch (err) {
      console.error('마지막 저장 파일을 읽는 중 오류가 발생했습니다:', err)
      return null
    }
  }

  async loadFile(showPicker: boolean = true): Promise<Resume> {
    try {
      console.log('파일 불러오기 시작')
      
      // 파일 선택 대화상자를 통해 파일 선택
      const [handle] = await window.showOpenFilePicker({
        startIn: 'downloads',
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] }
        }]
      })

      console.log('파일 핸들 획득:', handle)
      const file = await handle.getFile()
      console.log('파일 획득:', file.name)
      
      const content = await file.text()
      const data = JSON.parse(content) as Resume
      console.log('파일 내용 파싱 완료')
      
      this.lastSavedHandle = handle
      this.saveLastPath(file.name)
      return data
    } catch (err) {
      console.error('파일 불러오기 실패:', err)
      throw err
    }
  }

  async selectSaveFile(): Promise<FileSystemFileHandle> {
    try {
      const lastPath = this.getLastSavedPath()
      const handle = await window.showSaveFilePicker({
        suggestedName: lastPath || undefined,
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] }
        }]
      })
      
      this.lastSavedHandle = handle
      const file = await handle.getFile()
      this.saveLastPath(file.name)
      return handle
    } catch (err) {
      throw err
    }
  }

  async saveToFile(data: Resume, handle: FileSystemFileHandle): Promise<void> {
    try {
      const writable = await handle.createWritable()
      await writable.write(JSON.stringify(data, null, 2))
      await writable.close()
      this.lastSavedHandle = handle
    } catch (err) {
      throw err
    }
  }

  async downloadAs(resume: Resume, format: 'json' | 'html' | 'pdf'): Promise<void> {
    if (format === 'pdf') {
      const content = await convertResumeToHtml(resume)
      const blob = new Blob([content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      
      // 새 창 열기
      const printWindow = window.open(url, '_blank')
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
        return
      }

      // 프린트 다이얼로그 열기
      printWindow.onload = () => {
        printWindow.print()
        // 프린트 다이얼로그가 닫힐 때 창 닫기
        const checkPrintDialogClosed = setInterval(() => {
          if (printWindow.document.readyState === 'complete') {
            clearInterval(checkPrintDialogClosed)
            if (!printWindow.document.queryCommandEnabled('print')) {
              printWindow.close()
              URL.revokeObjectURL(url)
            }
          }
        }, 1000)
      }
    } else {
      const content = format === 'json'
        ? JSON.stringify(resume, null, 2)
        : await convertResumeToHtml(resume)

      const blob = new Blob([content], {
        type: format === 'json' ? 'application/json' : 'text/html'
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume.${format}`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  getLastSavedHandle(): FileSystemFileHandle | null {
    return this.lastSavedHandle
  }

  getLastSavedFileName(): string | null {
    return this.lastSavedHandle?.name || null
  }
}

export const fileService = new FileService() 