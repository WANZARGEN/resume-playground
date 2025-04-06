import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { twMerge } from 'tailwind-merge'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}

export const Select = ({ value, onChange, options, placeholder, className }: SelectProps) => {
  const selectedOption = options.find(option => option.value === value)

  return (
    <Listbox value={value} onChange={onChange}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className={twMerge(
            "relative w-full bg-white px-3 py-1.5 text-left text-sm appearance-none",
            "rounded-lg border border-gray-200",
            "hover:bg-gray-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-100",
            "ui-open:ring-2 ui-open:ring-blue-100",
            className
          )}>
            <span className={`block truncate ${!selectedOption?.label ? 'text-gray-400' : 'text-gray-900'}`}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
                aria-hidden="true" 
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none px-3 py-1.5 ${
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {option.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
} 