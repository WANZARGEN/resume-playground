import { Listbox } from '@headlessui/react'
import { useResume, resumeFormats } from '../contexts/ResumeContext'

interface Props {
  onDownload: (data: any, format: 'json' | 'html') => void
  onSave: (data: any, directory: FileSystemDirectoryHandle) => void
  onLoad: () => void
}

function ResumeHeader({ onDownload, onSave, onLoad }: Props) {
  const {
    activeTab,
    setActiveTab,
    editData,
    saveDirectory,
    setSaveDirectory,
    selectedFormat,
    setSelectedFormat,
  } = useResume()

  const handleSave = () => {
    if (saveDirectory) {
      onSave(editData, saveDirectory)
    }
  }

  const handleDownload = () => {
    onDownload(editData, selectedFormat.id)
  }

  const handleDirectorySelect = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      setSaveDirectory(dirHandle)
      onSave(editData, dirHandle)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('디렉토리 선택 중 오류가 발생했습니다:', err)
      }
    }
  }

  return (
    <div className="bg-white shadow">
      <div className="max-w-[2400px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-gray-900">이력서 에디터</h1>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md h-10 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('edit')}
            >
              편집
            </button>
            <button
              className={`px-4 py-2 rounded-md h-10 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setActiveTab('preview')}
            >
              미리보기
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 h-10 cursor-pointer"
            onClick={onLoad}
          >
            불러오기
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg h-10">
            <span className="text-sm text-gray-500">자동 저장:</span>
            {saveDirectory ? (
              <div className="flex flex-col">
                <button
                  className="text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-1"
                  onClick={handleDirectorySelect}
                >
                  <span className="text-sm font-medium">{saveDirectory.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <span className="text-xs text-gray-500">{(saveDirectory as any).path}</span>
              </div>
            ) : (
              <button
                className="text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-1"
                onClick={handleDirectorySelect}
              >
                <span className="text-sm">저장 경로 선택</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                  <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
                </svg>
              </button>
            )}
            <button
              className={`px-4 py-1 rounded ${
                saveDirectory
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleSave}
              disabled={!saveDirectory}
            >
              저장
            </button>
          </div>
          <div className="relative w-44">
            <Listbox as="div" value={selectedFormat} onChange={setSelectedFormat}>
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
                          <div>
                            <span
                              className={`block truncate ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {format.name}
                            </span>
                            <span className="block truncate text-xs text-gray-500">
                              {format.description}
                            </span>
                          </div>
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
  )
}

export default ResumeHeader 