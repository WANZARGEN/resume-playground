import { OpenAIResponse } from '../types/openai';

// Error messages for better error handling
const ERROR_MESSAGES = {
  RATE_LIMIT: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  API_ERROR: 'API 호출 중 오류가 발생했습니다.',
  INVALID_API_KEY: 'API 키가 유효하지 않습니다.',
  NETWORK_ERROR: '네트워크 연결에 문제가 있습니다.',
};

/**
 * Generates text completion using OpenAI API
 * @param prompt The text to generate completion for
 * @returns Promise with the completion response
 */
export const generateCompletion = async (prompt: string): Promise<OpenAIResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key is not defined in environment variables');
    return {
      text: '',
      error: 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer. Complete the given text professionally and concisely.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        return { text: '', error: ERROR_MESSAGES.RATE_LIMIT };
      } else if (response.status === 401) {
        return { text: '', error: ERROR_MESSAGES.INVALID_API_KEY };
      } else {
        console.error('OpenAI API error:', errorData);
        return { text: '', error: ERROR_MESSAGES.API_ERROR };
      }
    }

    const data = await response.json();
    return {
      text: data.choices[0]?.message?.content || ''
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      text: '',
      error: ERROR_MESSAGES.NETWORK_ERROR
    };
  }
}; 