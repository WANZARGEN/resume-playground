import { useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

export default function StyleGuidePin() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-[400px]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium">텍스트 스타일 가이드</span>
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5" />
          ) : (
            <ChevronUpIcon className="w-5 h-5" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-start gap-4">
              <code className="shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">**텍스트**</code>
              <div className="space-y-1">
                <div>강조 텍스트</div>
                <div className="font-bold text-gray-700">예시: 이것은 강조된 텍스트입니다</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <code className="shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">##텍스트##</code>
              <div className="space-y-1">
                <div>보조 강조</div>
                <div className="font-semibold text-gray-500">예시: 이것은 보조 강조 텍스트입니다</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <code className="shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">`텍스트`</code>
              <div className="space-y-1">
                <div>하이라이트</div>
                <div className="bg-yellow-50 px-1 rounded">예시: 이것은 하이라이트된 텍스트입니다</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <code className="shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">[텍스트](URL)</code>
              <div className="space-y-1">
                <div>링크</div>
                <div><a href="#" className="text-blue-600 hover:underline">예시: 이것은 링크 텍스트입니다</a></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 