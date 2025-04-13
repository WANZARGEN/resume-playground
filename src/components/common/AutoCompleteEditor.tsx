import { useState, useEffect, useCallback, useRef } from 'react';
import { generateCompletion } from '../../services/gemini';
import { AutoCompleteProps } from '../../types/openai';

export const AutoCompleteEditor: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getSuggestion = useCallback(async (text: string) => {
    if (text.trim().length < 10) {
      setSuggestion('');
      return;
    }

    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError('');

    try {
      const response = await generateCompletion(text);
      if (response.error) {
        setError(response.error);
      } else {
        setSuggestion(response.text);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was aborted, do nothing
        return;
      }
      setError('자동완성 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (isFocused) {
        getSuggestion(value);
      }
    }, 600); // 600ms debounce time for better responsiveness

    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value, getSuggestion, isFocused]);

  const handleApplySuggestion = () => {
    onChange(value + ' ' + suggestion);
    setSuggestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Tab or Ctrl+Enter to apply suggestion
    if (suggestion && !isLoading && !error && 
        ((e.key === 'Tab' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey))) {
      e.preventDefault();
      handleApplySuggestion();
    }
    
    // Escape to dismiss suggestion
    if (e.key === 'Escape' && suggestion) {
      e.preventDefault();
      setSuggestion('');
    }
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className}`}
        rows={4}
        aria-describedby={suggestion ? "autocomplete-suggestion" : undefined}
      />
      
      {isLoading && (
        <div 
          className="absolute z-10 top-full left-0 w-full bg-gray-50 p-2 border rounded mt-1"
          role="status"
          aria-live="polite"
        >
          <p className="text-gray-600">자동완성 생성 중...</p>
        </div>
      )}

      {error && (
        <div 
          className="absolute z-10 top-full left-0 w-full bg-red-50 p-2 border border-red-200 rounded mt-1"
          role="alert"
        >
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {!isLoading && !error && suggestion && (
        <div 
          className="absolute z-10 top-full left-0 w-full bg-gray-50 p-2 border rounded mt-1"
          id="autocomplete-suggestion"
          ref={suggestionsRef}
          role="complementary"
          aria-label="자동완성 제안"
        >
          <p className="text-gray-600 mb-2">{suggestion}</p>
          <button
            ref={buttonRef}
            onClick={handleApplySuggestion}
            className="text-sm text-blue-500 hover:text-blue-700"
            aria-keyshortcuts="Control+Enter Tab"
          >
            제안 적용하기 (Ctrl+Enter 또는 Tab)
          </button>
        </div>
      )}
    </div>
  );
}; 