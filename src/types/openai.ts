import { Employment, Education } from './resume';

export interface OpenAIResponse {
  text: string;
  error?: string;
}

export interface ResumeContext {
  employments?: Employment[];
  education?: Education[];
}

export interface AutoCompleteProps {
  value: string;
  onChange: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  previousContent?: string;
  resumeContext?: ResumeContext;
} 