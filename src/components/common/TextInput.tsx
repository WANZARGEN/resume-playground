import  { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function TextInput({ className, ...props }: Props) {
  return (
    <input
      type="text"
      className={clsx(
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
        className
      )}
      {...props}
    />
  )
} 