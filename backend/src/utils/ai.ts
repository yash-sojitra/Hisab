import { GoogleGenAI } from "@google/genai";

//gemini helper
export const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
