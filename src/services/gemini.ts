import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAIResponse, ResumeContext } from '../types/openai';
import { Employment, Education } from '../types/resume';

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
 * @param previousContent The content of the previous paragraph
 * @param resumeContext The current resume context including employment, education, etc.
 * @returns Promise with the completion response
 */
export const generateCompletion = async (
  prompt: string, 
  previousContent?: string,
  resumeContext?: ResumeContext
): Promise<OpenAIResponse> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is not defined in environment variables');
    return {
      text: '',
      error: 'API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.'
    };
  }

  // Format resume context for the prompt
  const formatEmployment = (emp: Employment) => {
    if (!emp.company || !emp.position) return '';
    
    return `Company: ${emp.company}
    Position: ${emp.position}
    Period: ${emp.period?.start || ''} - ${emp.period?.end || ''}
    Tech Stack: ${emp.techStack?.map(t => t.name).join(', ') || ''}
    ${emp.details?.map(d => `
      ${d.title}:
      ${d.items?.map(item => `- ${item.text}`).join('\n') || ''}`).join('\n') || ''}`;
  };

  const formatEducation = (edu: Education) => {
    if (!edu.type) return '';
    
    return `Type: ${edu.type}
    ${edu.items?.map(item => `- ${item.title}: ${item.description || ''}`).join('\n') || ''}`;
  };

  const contextStr = resumeContext ? `
    Current Resume Context:
    
    Employment History:
    ${resumeContext.employments?.map(formatEmployment).join('\n\n') || 'No employment history yet.'}
    
    Education and Activities:
    ${resumeContext.education?.map(formatEducation).join('\n\n') || 'No education/activities yet.'}
    ` : '';

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user",
        parts: [{ 
          text: `You are writing a professional resume in Korean. Generate a single paragraph (2-3 sentences) that fits naturally with the existing content.

                Requirements:
                1. Response Format:
                   - Provide ONLY the new paragraph content
                   - Keep it to 2-3 sentences
                   - Use natural Korean business writing
                
                2. Content Guidelines:
                   ${!previousContent ? `
                   - Write a strong opening paragraph
                   - Introduce core competencies
                   - Set professional tone
                   ` : `
                   - Continue the narrative flow
                   - Add complementary information
                   - Maintain consistent tone
                   `}

                3. Use these markdown styles:
                   - **text** for key achievements
                   - ##text## for titles/positions
                   - \`text\` for technical terms

                Context (for reference only):
                ${contextStr}
                ${previousContent ? `Previous paragraphs:\n${previousContent}\n` : ''}
                ${prompt ? `Current draft: ${prompt}` : 'Generate a new paragraph.'}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 250,
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