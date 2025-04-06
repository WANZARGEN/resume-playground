import React, { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ children, className, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-700 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
} 