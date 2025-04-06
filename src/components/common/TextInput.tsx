import React, { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function TextInput({ className, ...props }: Props) {
  return (
    <input
      type="text"
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        className
      )}
      {...props}
    />
  )
} 