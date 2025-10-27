// src/types/index.ts

export interface OCRResult {
    text: string;
    confidence: number;
}

export interface Summary {
    title: string;
    content: string;
}

export interface QA {
    question: string;
    answer: string;
}

export interface UserQuestion {
    id: string;
    question: string;
    timestamp: Date;
}

export interface UserAnswer {
    id: string;
    answer: string;
    questionId: string;
    timestamp: Date;
}