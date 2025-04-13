export interface OpenAIResponse {
  text: string;
  error?: string;
}

export interface AutoCompleteProps {
  value: string;
  onChange: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
} 