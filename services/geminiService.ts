
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketInsights = async (country: string, category: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the current TikTok e-commerce trends in ${country} for the ${category} category. Provide insights on pricing, popular items, and content strategies.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  // Extract text and grounding sources from the response.
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const askAgent = async (query: string, history: {role: string, parts: {text: string}[]}[]) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    // Include full conversation history in the contents array.
    contents: [...history, { role: 'user', parts: [{ text: query }] }],
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: "You are a TikTok E-commerce Data Expert. Use your deep knowledge of FastMoss analytics to help users with shop diagnosis, influencer selection, and market trends. Be concise for a mobile user.",
      tools: [{ googleSearch: {} }]
    }
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const generateVoiceResponse = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      // Use Modality.AUDIO from @google/genai
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  // Return base64 audio data.
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
