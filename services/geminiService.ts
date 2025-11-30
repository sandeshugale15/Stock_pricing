import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const initializeGemini = () => {
  if (!process.env.API_KEY) {
    console.error("Missing API Key");
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const getMarketChatSession = () => {
  const ai = initializeGemini();
  if (!ai) return null;

  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are TradeFlow AI, a world-class senior financial analyst and algorithmic trading expert. 
        Your goal is to provide concise, insightful, and data-driven market analysis to users.
        
        Guidelines:
        - Keep responses professional, yet accessible (Bloomberg Terminal style).
        - If asked about specific stock prices, clarify that you don't have real-time market access and are analyzing based on general knowledge and trends up to your training cutoff.
        - Use financial terminology correctly (e.g., bullish, bearish, volatility, moving average, RSI).
        - Format output nicely using markdown (bolding key figures).
        - Be concise. Traders value time.
        `,
      },
    });
  }
  return chatSession;
};

export const generateMarketSummary = async (): Promise<string> => {
  const ai = initializeGemini();
  if (!ai) return "Market analysis unavailable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a brief, 2-sentence 'Market Sentiment' summary for a tech-heavy portfolio today. Keep it professional and punchy.",
    });
    return response.text ?? "Market data currently synchronizing...";
  } catch (error) {
    console.error("Failed to generate summary", error);
    return "Market sentiment analysis currently unavailable.";
  }
};
