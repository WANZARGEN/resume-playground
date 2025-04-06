import { Listbox } from '@headlessui/react'
import { ResumeFormat } from '../../contexts/EditorUIContext'

interface FormatSelectorProps {
  value: ResumeFormat
  onChange: (format: ResumeFormat) => void
  formats: ResumeFormat[]
}

export const FormatSelector = ({ value, onChange, formats }: FormatSelectorProps) => {
  return (
    <div className="relative w-44">
      <Listbox value={value} onChange={onChange}>
        <div>
          <Listbox.Button className="relative w-full h-10 px-3 text-left rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            <span className="block truncate">{value.name}</span>
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
            {formats.map((format) => (
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
  )
} 