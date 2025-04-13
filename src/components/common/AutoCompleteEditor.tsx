import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCompletion } from '../../services/gemini';
import { AutoCompleteProps } from '../../types/openai';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ApiKeyDialog } from './ApiKeyDialog';

export const AutoCompleteEditor: React.FC<AutoCompleteProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className = '',
  previousContent,
  resumeContext
}) => {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pendingRequestRef = useRef<(() => void) | null>(null);

  const { mutate: getSuggestion, data: suggestion, isPending } = useMutation({
    mutationFn: async () => {
      const response = await generateCompletion(value || '', previousContent, resumeContext);
      if (response.text) {
        setShowSuggestion(true);
      }
      return response.text || null;
    }
  });

  const handleGetSuggestion = () => {
    const apiKey = sessionStorage.getItem('gemini-api-key');
    if (!apiKey) {
      pendingRequestRef.current = () => getSuggestion();
      setShowApiKeyDialog(true);
      return;
    }
    getSuggestion();
  };

  const handleApiKeySubmit = () => {
    if (pendingRequestRef.current) {
      pendingRequestRef.current();
      pendingRequestRef.current = null;
    }
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      onChange(suggestion);
      setShowSuggestion(false);
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
    if (e.key === 'Escape' && showSuggestion) {
      e.preventDefault();
      setShowSuggestion(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 ${className}`}
          rows={4}
          aria-describedby={suggestion ? "autocomplete-suggestion" : undefined}
        />
        <button
          onClick={handleGetSuggestion}
          disabled={isPending}
          className="self-start px-2 py-1.5 text-gray-600 hover:text-blue-600 disabled:text-gray-400 cursor-pointer transition-colors duration-200 ease-in-out rounded hover:bg-gray-100"
          title="AI 제안 받기"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
      
      {isPending && (
        <div 
          className="absolute top-0 right-0 translate-x-full pl-4 w-96 z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-gray-50 p-2 border rounded">
            <p className="text-gray-600">자동완성 생성 중...</p>
          </div>
        </div>
      )}

      {/* Suggestions display */}
      {!isPending && suggestion && showSuggestion && (
        <div 
          className="absolute top-0 right-0 translate-x-full pl-4 w-96 z-50"
          id="autocomplete-suggestion"
          ref={suggestionsRef}
          role="complementary"
          aria-label="자동완성 제안"
        >
          <div className="bg-gray-50 p-2 border rounded">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{suggestion}</p>
              <button
                onClick={() => setShowSuggestion(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                title="닫기"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
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

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSubmit={handleApiKeySubmit}
      />
    </div>
  );
}; 