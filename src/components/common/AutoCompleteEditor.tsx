import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateCompletion } from '../../services/gemini';
import { AutoCompleteProps } from '../../types/openai';

export const AutoCompleteEditor: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: suggestion, isLoading } = useQuery({
    queryKey: ['autoComplete', value],
    queryFn: async () => {
      if (!isFocused || !value) return null;
      const response = await generateCompletion(value);
      return response.text || null;
    },
    enabled: isFocused && !!value,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10,   // Keep unused data for 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    networkMode: 'offlineFirst',
  });

  const handleChange = (newValue: string) => {
    onChange(newValue);
    // Prefetch the next query
    queryClient.prefetchQuery({
      queryKey: ['autoComplete', newValue],
      queryFn: async () => {
        const response = await generateCompletion(newValue);
        return response.text || null;
      },
    });
  };

  const handleApplySuggestion = () => {
    onChange(value + ' ' + suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab or Ctrl+Enter to apply suggestion
    if (suggestion && !isLoading && 
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
    <div className="relative flex gap-4">
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`flex-1 ${className}`}
        rows={4}
        aria-describedby={suggestion ? "autocomplete-suggestion" : undefined}
      />
      
      {isLoading && (
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
      {!isLoading && suggestion && isFocused && (
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
              className="text-sm text-blue-500 hover:text-blue-700"
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