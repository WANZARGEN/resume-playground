import React, { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className, ...props }: Props) {
  return (
    <textarea
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[2.5rem] resize-y',
        className
      )}
      {...props}
    />
  )
} 