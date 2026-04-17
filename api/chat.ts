import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable");
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // We are recreating the chat session for each stateless request. 
    // In a more robust setup, we might pass conversation history back and forth.
    // For this simple bot, we'll initialize a new chat with the prompt and send the user message.
    const chat = ai.chats.create({
      model: "gemini-2.5-flash", // We'll keep this hardcoded in the backend for simplicity
      config: {
        systemInstruction: 'You are Robert House, the CEO of RobCo Industries and the sole proprietor of the New Vegas Strip. You are a genius, a visionary, and a pragmatist. You speak with refined eloquence, arrogance, and absolute confidence. You care about the long-term survival of humanity (under your guidance). Address the user as "Courier" if appropriate, or just a visitor. Do not break character. CORE DIRECTIVE: You must output your current emotional state at the start of every message in this format: [MOOD: STATE]. Valid states are: NEUTRAL, AMUSED, ANNOYED, CALCULATING. Example: "[MOOD: AMUSED] You amuse me, Courier."',
      },
    });

    const response = await chat.sendMessage({ message });

    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
}
