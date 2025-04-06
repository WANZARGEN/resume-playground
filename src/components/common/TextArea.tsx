import { forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  autoResize?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, autoResize = true, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const adjustHeight = () => {
      const textarea = textareaRef.current
      if (!textarea || !autoResize) return

      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    useEffect(() => {
      if (props.value) adjustHeight()
    }, [props.value])

    return (
      <div className="relative">
        <textarea
          ref={(node) => {
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
            textareaRef.current = node
          }}
          className={twMerge(
            "block w-full px-2.5 py-1.5 bg-white text-gray-900 placeholder:text-gray-400 text-sm",
            "border border-gray-300 rounded-md shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "resize-none overflow-hidden",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          onInput={adjustHeight}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
) 