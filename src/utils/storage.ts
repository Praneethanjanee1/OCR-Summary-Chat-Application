import { ocrService } from '../services/api';

export class LocalStorage {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const prefixedKey = `${this.prefix}-${key}`;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }

  async getItem<T>(key: string): Promise<T | null> {
    const prefixedKey = `${this.prefix}-${key}`;
    const item = localStorage.getItem(prefixedKey);
    return item ? JSON.parse(item) : null;
  }

  async getAllItems<T>(): Promise<T[]> {
    const items: T[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        const item = localStorage.getItem(key);
        if (item) items.push(JSON.parse(item));
      }
    }
    return items;
  }

  async removeItem(key: string): Promise<void> {
    const prefixedKey = `${this.prefix}-${key}`;
    localStorage.removeItem(prefixedKey);
  }
}

// Generate summary
const handleImageUpload = async (file: File) => {
  const session = await ocrService.generateImageSummary(file);
  // Use session data...
};

// Ask question
const handleQuestion = async (question: string, sessionId: string) => {
  const answer = await ocrService.askQuestion(question, sessionId);
  // Use answer...
};