import React, { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}

export function Button({ 
  children, 
  className, 
  variant = 'primary',
  size = 'sm',
  ...props 
}: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500': variant === 'primary',
          'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500': variant === 'secondary',
          'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500': variant === 'danger',
          'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
          'px-2.5 py-1.5 text-xs': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
} 