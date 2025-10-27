/// <reference types="vite/client" />
// Removed custom ImportMetaEnv and ImportMeta interfaces because Vite provides these types globally.

import OpenAI from 'openai';
import { LocalStorage } from '../utils/storage';

interface ImageSession {
  id: string;
  summary: string;
  imageUrl: string;
  timestamp: number;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

class OCRService {
  private storage: LocalStorage;

  constructor() {
    this.storage = new LocalStorage('ocr-sessions');
  }

  async generateImageSummary(image: File): Promise<ImageSession> {
    try {
      const base64Image = await this.fileToBase64(image);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and provide a detailed summary." },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      });

      const session: ImageSession = {
        id: crypto.randomUUID(),
        summary: response.choices[0]?.message?.content || '',
        imageUrl: URL.createObjectURL(image),
        timestamp: Date.now()
      };

      await this.storage.setItem(session.id, session);
      return session;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async askQuestion(questionText: string, sessionId: string): Promise<string> {
    try {
      const session = await this.storage.getItem<ImageSession>(sessionId);
      if (!session) throw new Error('Session not found');

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Context from image: ${session.summary}`,
          },
          {
            role: "user",
            content: questionText,
          },
        ],
        max_tokens: 200,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }

  async getSessions(): Promise<ImageSession[]> {
    return this.storage.getAllItems<ImageSession>();
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const ocrService = new OCRService();