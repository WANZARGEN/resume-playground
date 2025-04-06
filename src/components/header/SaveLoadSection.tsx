import { fileService } from '../../services/fileService'
import toast from 'react-hot-toast'
import { Resume } from '../../types/resume'

interface SaveLoadSectionProps {
  onLoad: (data: Resume) => void
  onSave: (data: Resume) => void
  data: Resume
}

export const SaveLoadSection = ({ onLoad, onSave, data }: SaveLoadSectionProps) => {
  const handleLoad = async () => {
    try {
      const loadedData = await fileService.loadFile(true)
      onLoad(loadedData)
      toast.success('이력서를 불러왔습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('파일을 불러오는 중 오류가 발생했습니다:', err)
        toast.error('파일을 불러오는데 실패했습니다.')
      }
    }
  }

  const handleSelectSaveFile = async () => {
    try {
      await fileService.selectSaveFile()
      await handleSave()
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('파일 선택 중 오류가 발생했습니다:', err)
        toast.error('파일 선택에 실패했습니다.')
      }
    }
  }

  const handleSave = async () => {
    try {
      const lastHandle = fileService.getLastSavedHandle()
      if (!lastHandle) {
        toast.error('먼저 저장할 파일을 선택해주세요.')
        return
      }
      await fileService.saveToFile(data, lastHandle)
      onSave(data)
      toast.success('이력서가 저장되었습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('저장 중 오류가 발생했습니다:', err)
        toast.error('저장에 실패했습니다.')
      }
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg h-10">
      <button
        className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
        onClick={handleLoad}
      >
        불러오기
      </button>
      <span className="text-gray-300">|</span>
      <span className="text-sm text-gray-500">저장:</span>
      {fileService.getLastSavedHandle() ? (
        <span className="text-sm font-medium">
          {fileService.getLastSavedFileName()}
        </span>
      ) : (
        <button
          className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
          onClick={handleSelectSaveFile}
        >
          {fileService.getLastSavedPath() || '파일 선택'}
        </button>
      )}
      <button
        className={`px-4 py-1 rounded-lg font-medium ${
          fileService.getLastSavedHandle()
            ? 'bg-gray-600 text-white hover:bg-gray-700 cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={handleSave}
        disabled={!fileService.getLastSavedHandle()}
      >
        저장
      </button>
    </div>
  )
} 