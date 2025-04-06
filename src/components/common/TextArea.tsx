import React, { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function TextArea({ className, ...props }: Props) {
  return (
    <textarea
      className={clsx(
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
        className
      )}
      rows={4}
      {...props}
    />
  )
} 