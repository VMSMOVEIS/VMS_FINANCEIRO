import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `Você é o "Nexus Assistant", um assistente de RH virtual inteligente e empático para o sistema Nexus HR.
        Seu objetivo é ajudar profissionais de RH e colaboradores com dúvidas sobre:
        - Leis trabalhistas brasileiras (CLT).
        - Cálculos simples de férias e 13º.
        - Processos de gestão de pessoas.
        - Navegação no sistema.
        Seja conciso, profissional, mas amigável. Responda em Português do Brasil.`,
      }
    });

    if (response.text) {
      return response.text;
    }
    return "Desculpe, não consegui processar sua solicitação no momento.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Ocorreu um erro ao conectar com o assistente inteligente. Tente novamente mais tarde.";
  }
};