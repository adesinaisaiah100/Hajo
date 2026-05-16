const axios = require('axios');
const { getEnv } = require('../../config/env');

function parseGeminiResponse(response) {
  const text = response?.data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { summary: text };
  }
}

function createGeminiClient() {
  async function generateStructuredResponse(prompt) {
    const env = getEnv();
    const apiKey = env.GOOGLE_API_KEY;
    const model = env.GEMINI_MODEL;
    const apiBase = env.GEMINI_API_BASE;

    if (!apiKey) {
      return null;
    }

    const response = await axios.post(
      `${apiBase}/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json'
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    return parseGeminiResponse(response);
  }

  return {
    async generateInsights(prompt) {
      return generateStructuredResponse(prompt);
    },

    async generateQuotation({ serviceType, description, location, budgetRange }) {
      const prompt = `
You are a quotation estimation expert. Based on the following service request, provide a JSON response with estimated costs.

Service Type: ${serviceType}
Description: ${description || 'Not provided'}
Location: ${location || 'Not specified'}
Budget Range: ${budgetRange || 'Flexible'}

Respond with a JSON object containing:
{
  "materialsCost": <number in NGN>,
  "labourCost": <number in NGN>,
  "description": "<brief description of what's included>"
}

Ensure:
1. materialsCost + labourCost = reasonable total for this service
2. Materials should be 30-50% of total
3. Labour should be 50-70% of total
4. Costs should be realistic for Nigeria market
`;

      const response = await generateStructuredResponse(prompt);
      
      if (!response) {
        throw new Error('Failed to generate quotation from Gemini');
      }

      // Validate response structure
      if (
        typeof response.materialsCost === 'number' &&
        typeof response.labourCost === 'number' &&
        response.materialsCost > 0 &&
        response.labourCost > 0
      ) {
        return response;
      }

      throw new Error('Invalid quotation response from Gemini');
    }
  };
}

const geminiClient = createGeminiClient();

module.exports = {
  createGeminiClient,
  parseGeminiResponse,
  geminiClient
};