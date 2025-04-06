import { useEditorUI, resumeFormats } from '../contexts/EditorUIContext'
import { useResumeData } from '../contexts/ResumeDataContext'
import { fileService } from '../services/fileService'
import toast, { Toaster } from 'react-hot-toast'
import React from 'react'
import { ViewModeSelector } from './header/ViewModeSelector'
import { FormatSelector } from './header/FormatSelector'
import { SaveLoadSection } from './header/SaveLoadSection'
import { LastFileModal } from './header/LastFileModal'

function ResumeHeader() {
  const { data, setData } = useResumeData()
  const {
    activeTab,
    setActiveTab,
    selectedFormat,
    setSelectedFormat,
    setLastSavedData,
  } = useEditorUI()
  const [isLastFileModalOpen, setIsLastFileModalOpen] = React.useState(false)

  // 페이지 로드 시 마지막 저장 파일 확인
  React.useEffect(() => {
    const lastPath = fileService.getLastSavedPath()
    if (lastPath) {
      setIsLastFileModalOpen(true)
    }
  }, [])

  const handleLoadLastFile = async () => {
    try {
      const loadedData = await fileService.loadFile(false)
      setData(loadedData)
      setLastSavedData(loadedData)
      setIsLastFileModalOpen(false)
      toast.success('이력서를 불러왔습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('마지막 파일을 불러오는 중 오류가 발생했습니다:', err)
        toast.error('마지막 파일을 불러오는데 실패했습니다.')
      }
    }
  }

  const handleSelectNewFile = async () => {
    try {
      const loadedData = await fileService.loadFile(true)
      setData(loadedData)
      setLastSavedData(loadedData)
      setIsLastFileModalOpen(false)
      toast.success('이력서를 불러왔습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('새 파일을 선택하는 중 오류가 발생했습니다:', err)
        toast.error('새 파일 선택에 실패했습니다.')
      }
    }
  }

  const handleClearLastFile = () => {
    fileService.clearLastSavedPath()
    setIsLastFileModalOpen(false)
  }

  const handleDownload = async () => {
    try {
      await fileService.downloadAs(data, selectedFormat.id)
      toast.success('이력서가 다운로드되었습니다.')
    } catch (err) {
      console.error('다운로드 중 오류가 발생했습니다:', err)
      toast.error('다운로드에 실패했습니다.')
    }
  }

  return (
    <>
      <Toaster position="top-center" />
      <LastFileModal
        isOpen={isLastFileModalOpen}
        onLoadLastFile={handleLoadLastFile}
        onSelectNewFile={handleSelectNewFile}
        onClearLastFile={handleClearLastFile}
      />
      <div className="bg-white shadow">
        <div className="max-w-[2400px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">이력서 에디터</h1>
            <ViewModeSelector activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="flex items-center gap-2">
            <SaveLoadSection
              data={data}
              onLoad={setData}
              onSave={setLastSavedData}
            />
            <FormatSelector
              value={selectedFormat}
              onChange={setSelectedFormat}
              formats={resumeFormats}
            />
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 h-10 cursor-pointer"
              onClick={handleDownload}
            >
              다운로드
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResumeHeader 