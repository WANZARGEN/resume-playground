export interface OpenAIResponse {
  text: string;
  error?: string;
}

export interface AutoCompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
} 