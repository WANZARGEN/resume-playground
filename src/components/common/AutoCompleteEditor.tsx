import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCompletion } from '../../services/gemini';
import { AutoCompleteProps } from '../../types/openai';
import { SparklesIcon } from '@heroicons/react/24/outline';

export const AutoCompleteEditor: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { mutate: getSuggestion, data: suggestion, isPending } = useMutation({
    mutationFn: async () => {
      if (!value) return null;
      const response = await generateCompletion(value);
      return response.text || null;
    }
  });

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onChange(value + ' ' + suggestion);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab or Ctrl+Enter to apply suggestion
    if (suggestion && !isPending && 
        ((e.key === 'Tab' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey))) {
      e.preventDefault();
      handleApplySuggestion();
    }
    
    // Escape to dismiss suggestion
    if (e.key === 'Escape' && suggestion) {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 ${className}`}
          rows={4}
          aria-describedby={suggestion ? "autocomplete-suggestion" : undefined}
        />
        <button
          onClick={() => getSuggestion()}
          disabled={!value || isPending}
          className="self-start px-2 py-1.5 text-gray-600 hover:text-blue-600 disabled:text-gray-400 cursor-pointer transition-colors duration-200 ease-in-out rounded hover:bg-gray-100"
          title="AI 제안 받기"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
      
      {isPending && (
        <div 
          className="absolute right-0 translate-x-full pl-4 w-96 z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-gray-50 p-2 border rounded">
            <p className="text-gray-600">자동완성 생성 중...</p>
          </div>
        </div>
      )}

      {/* Suggestions display */}
      {!isPending && suggestion && isFocused && (
        <div 
          className="absolute right-0 translate-x-full pl-4 w-96 z-50"
          id="autocomplete-suggestion"
          ref={suggestionsRef}
          role="complementary"
          aria-label="자동완성 제안"
        >
          <div className="bg-gray-50 p-2 border rounded">
            <p className="text-gray-600 text-sm whitespace-pre-wrap mb-2">{suggestion}</p>
            <button
              ref={buttonRef}
              onClick={handleApplySuggestion}
              className="text-sm text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200 ease-in-out px-3 py-1.5 rounded hover:bg-blue-50"
              aria-keyshortcuts="Control+Enter Tab"
            >
              제안 적용하기 (Ctrl+Enter 또는 Tab)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 