import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PROJECTS, SKILLS } from "../constants";

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey || '' });

  // Constructing a context-aware system instruction
  const projectContext = PROJECTS.map(p => `- ${p.title}: ${p.description} (Tech: ${p.tags.join(', ')})`).join('\n');
  const skillContext = SKILLS.map(s => `- ${s.name}: ${s.level}%`).join('\n');

  const systemInstruction = `
    You are an AI portfolio assistant for "Venkata Sai Hanuman Kimidi".
    Your tone is professional, confident, and eager to demonstrate technical competence.
    
    Profile Summary:
    - Dynamic and results-driven Java professional.
    - MCA Graduate (2024) with 7.96 CGPA.
    - Hands-on experience from Besant Technologies training.
    - Skilled in Problem Solving, Teamwork, and Meeting Deadlines.
    
    Here is Venkata's Project Portfolio:
    ${projectContext}

    Here are Venkata's Skills:
    ${skillContext}
    
    Certifications:
    - Microsoft Azure Fundamentals
    - HTML Course (Udemy)
    
    Interests:
    - Artificial Intelligence, Cricket, Music, Reading Tech Articles.

    If asked about contact, direct them to email: kvsh19997@gmail.com or phone: 6300399838.
    Answer questions concisely (under 50 words usually) unless asked for detail.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = initializeChat();
    const response: GenerateContentResponse = await session.sendMessage({ message });
    return response.text || "I'm having trouble thinking right now. Try again later.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I seem to be offline. Please check your connection or try again later.";
  }
};