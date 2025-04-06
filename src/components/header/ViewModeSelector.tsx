import { RadioGroup } from '@headlessui/react'
import { ViewMode } from '../../contexts/EditorUIContext'

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

interface ViewModeSelectorProps {
  activeTab: ViewMode
  onChange: (tab: ViewMode) => void
}

export const ViewModeSelector = ({ activeTab, onChange }: ViewModeSelectorProps) => {
  return (
    <RadioGroup value={activeTab} onChange={onChange} className="flex bg-gray-100 p-1 rounded-lg">
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
  )
} 