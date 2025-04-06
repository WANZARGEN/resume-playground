import { forwardRef, InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: string;
  className?: string;
  wrapperClassName?: string;
  inputSize?: 'sm' | 'md';
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, wrapperClassName, error, inputSize = 'md', ...props }, ref) => {
    return (
      <div className={twMerge("relative", wrapperClassName)}>
        <input
          ref={ref}
          type="text"
          className={twMerge(
            "block w-full bg-white text-sm appearance-none",
            "rounded-lg border border-gray-200",
            "hover:bg-gray-50",
            "focus:outline-none focus:ring-2 focus:ring-blue-100",
            inputSize === 'md' && "px-3 py-1.5",
            inputSize === 'sm' && "px-3 py-1",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
) 