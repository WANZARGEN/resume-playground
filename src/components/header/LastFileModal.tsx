import { Dialog } from '@headlessui/react'
import { fileService } from '../../services/fileService'

interface LastFileModalProps {
  isOpen: boolean
  onLoadLastFile: () => void
  onSelectNewFile: () => void
  onClearLastFile: () => void
}

export const LastFileModal = ({
  isOpen,
  onLoadLastFile,
  onSelectNewFile,
  onClearLastFile,
}: LastFileModalProps) => {
  return (
    <Dialog
      open={isOpen}
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
              onClick={onLoadLastFile}
            >
              이전 파일 불러오기
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer"
              onClick={onSelectNewFile}
            >
              다른 파일 선택하기
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 cursor-pointer"
              onClick={onClearLastFile}
            >
              선택하지 않고 새로 시작하기
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 