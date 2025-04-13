import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAIResponse } from '../types/openai';

// Error messages for better error handling
const ERROR_MESSAGES = {
  RATE_LIMIT: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  API_ERROR: 'API 호출 중 오류가 발생했습니다.',
  INVALID_API_KEY: 'API 키가 유효하지 않습니다.',
  NETWORK_ERROR: '네트워크 연결에 문제가 있습니다.',
};

/**
 * Generates text completion using Gemini API
 * @param prompt The text to generate completion for
 * @returns Promise with the completion response
 */
export const generateCompletion = async (prompt: string): Promise<OpenAIResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is not defined in environment variables');
    return {
      text: '',
      error: 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user",
        parts: [{ 
          text: `As a professional resume writer, complete the following text professionally and concisely.
                Keep the style consistent with the input.
                Text to complete: ${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 100,
      },
    });

    const response = await result.response;
    return {
      text: response.text()
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('429')) {
        return { text: '', error: ERROR_MESSAGES.RATE_LIMIT };
      } else if (error.message.includes('401')) {
        return { text: '', error: ERROR_MESSAGES.INVALID_API_KEY };
      }
    }
    
    return {
      text: '',
      error: ERROR_MESSAGES.API_ERROR
    };
  }
}; 