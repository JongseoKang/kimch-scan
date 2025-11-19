
import { GoogleGenAI } from "@google/genai";
import { CryptoItem } from "../types";

// Note: In a real app, never expose API keys on the client side.
// This is for demonstration purposes as per instructions.

export const generateMarketAnalysis = async (topMovers: CryptoItem[]): Promise<string> => {
  // API Key 확인 (Vite define에 의해 문자열로 치환됨)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API Key is missing");
    return "API Key가 설정되지 않아 AI 분석을 사용할 수 없습니다.";
  }

  if (topMovers.length === 0) return "분석할 데이터가 부족합니다.";

  // Construct a prompt based on the data
  const dataSummary = topMovers.map(coin => 
    `${coin.symbol}: ${coin.price} KRW (${parseFloat(coin.chgRate) > 0 ? '+' : ''}${coin.chgRate}%)`
  ).join('\n');

  const prompt = `
    You are a cryptocurrency market analyst.
    Analyze the following top market movers (high volume or high fluctuation) from Bithumb:
    
    ${dataSummary}

    Provide a concise, 2-sentence summary in Korean about the current market sentiment based on these specific coins.
    Focus on whether the market is bullish, bearish, or mixed, and highlight the most significant mover.
    Tone: Professional and objective.
  `;

  try {
    // 인스턴스를 함수 호출 시점에 생성 (Lazy Initialization)
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "분석 결과를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 분석 서비스를 이용할 수 없습니다.";
  }
};
