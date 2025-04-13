import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { TextInput } from './TextInput'
import { Button } from './Button'

interface ApiKeyDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
}

export function ApiKeyDialog({ isOpen, onClose, onSubmit }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) return

    // Store in sessionStorage
    sessionStorage.setItem('gemini-api-key', apiKey.trim())
    onSubmit?.()
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            API Key 설정
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <TextInput
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key를 입력하세요"
                className="w-full"
              />
              <p className="mt-2 text-sm text-gray-500">
                * API Key는 브라우저 탭이 열려있는 동안만 유지됩니다.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!apiKey.trim()}
              >
                저장
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 