import { Listbox, RadioGroup, Dialog } from '@headlessui/react'
import { useEditorUI, resumeFormats, ViewMode } from '../contexts/EditorUIContext'
import { useResumeData } from '../contexts/ResumeDataContext'
import { fileService } from '../services/fileService'
import toast, { Toaster } from 'react-hot-toast'
import React from 'react'

const viewModes: { id: ViewMode; name: string; icon: JSX.Element }[] = [
  {
    id: 'edit-only',
    name: '편집',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    ),
  },
  {
    id: 'split',
    name: '편집 + 미리보기',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'preview-only',
    name: '미리보기',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
      </svg>
    ),
  },
]

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

  const handleLoad = async (showPicker: boolean = false) => {
    try {
      const data = await fileService.loadFile(showPicker)
      setData(data)
      setLastSavedData(data)
      toast.success('이력서를 불러왔습니다.')
      return data  // 성공 시 데이터 반환
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        throw err  // AbortError는 상위로 전달
      }
      console.error('파일을 불러오는 중 오류가 발생했습니다:', err)
      toast.error('파일을 불러오는데 실패했습니다.')
      throw err  // 다른 에러도 상위로 전달
    }
  }

  // 페이지 로드 시 마지막 저장 파일 확인
  React.useEffect(() => {
    const lastPath = fileService.getLastSavedPath()
    if (lastPath) {
      setIsLastFileModalOpen(true)
    }
  }, [])

  const handleLoadLastFile = async () => {
    try {
      const loadedData = await handleLoad(false)
      if (loadedData) {  // 데이터가 성공적으로 로드된 경우에만 모달 닫기
        setIsLastFileModalOpen(false)
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // 파일 선택이 취소된 경우 모달을 유지
        return
      }
      console.error('마지막 파일을 불러오는 중 오류가 발생했습니다:', err)
      toast.error('마지막 파일을 불러오는데 실패했습니다.')
    }
  }

  const handleSelectNewFile = async () => {
    try {
      const loadedData = await handleLoad(true)
      if (loadedData) {  // 데이터가 성공적으로 로드된 경우에만 모달 닫기
        setIsLastFileModalOpen(false)
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        // 파일 선택이 취소된 경우 모달을 유지
        return
      }
      console.error('새 파일을 선택하는 중 오류가 발생했습니다:', err)
      toast.error('새 파일 선택에 실패했습니다.')
    }
  }

  const handleClearLastFile = () => {
    fileService.clearLastSavedPath()
    setIsLastFileModalOpen(false)
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
      setLastSavedData(data)
      toast.success('이력서가 저장되었습니다.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('저장 중 오류가 발생했습니다:', err)
        toast.error('저장에 실패했습니다.')
      }
    }
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
      <Dialog
        open={isLastFileModalOpen}
        onClose={() => {}}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 mb-4"
            >
              이전에 작업하던 이력서가 있습니다
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">
                경로: {fileService.getLastSavedPath()}
              </p>
              <p className="text-sm text-gray-500">
                어떻게 하시겠습니까?
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer"
                onClick={handleLoadLastFile}
              >
                이전 파일 불러오기
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer"
                onClick={handleSelectNewFile}
              >
                다른 파일 선택하기
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer"
                onClick={handleClearLastFile}
              >
                선택하지 않고 새로 시작하기
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
      <div className="bg-white shadow">
        <div className="max-w-[2400px] mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">이력서 에디터</h1>
            <RadioGroup value={activeTab} onChange={setActiveTab} className="flex bg-gray-100 p-1 rounded-lg">
              {viewModes.map((mode) => (
                <RadioGroup.Option
                  key={mode.id}
                  value={mode.id}
                  className={({ checked }) =>
                    `relative flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                      checked
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-700 hover:text-gray-900'
                    }`
                  }
                >
                  {({ checked }) => (
                    <>
                      {mode.icon}
                      <span className={`${checked ? 'font-medium' : ''}`}>
                        {mode.name}
                      </span>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg h-10">
              <button
                className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={() => handleLoad(true)}
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

            <div className="relative w-44">
              <Listbox value={selectedFormat} onChange={setSelectedFormat}>
                <div>
                  <Listbox.Button className="relative w-full h-10 px-3 text-left rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <span className="block truncate">{selectedFormat.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 py-1 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
                    {resumeFormats.map((format) => (
                      <Listbox.Option
                        key={format.id}
                        value={format}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {format.name}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>

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