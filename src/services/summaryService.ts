// src/services/summaryService.ts

interface Summary {
    id: string;
    text: string;
}

const SUMMARY_STORAGE_KEY = 'ocr_summaries';

export const saveSummary = (summary: Summary) => {
    const summaries = getSummaries();
    summaries.push(summary);
    localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(summaries));
};

export const getSummaries = (): Summary[] => {
    const summaries = localStorage.getItem(SUMMARY_STORAGE_KEY);
    return summaries ? JSON.parse(summaries) : [];
};

export const clearSummaries = () => {
    localStorage.removeItem(SUMMARY_STORAGE_KEY);
};