// src/utils/helpers.ts

export const formatData = (data: any): string => {
    // Function to format data for display
    return JSON.stringify(data, null, 2);
};

export const saveToLocalStorage = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key: string): any => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
};

export const clearLocalStorage = (key: string): void => {
    localStorage.removeItem(key);
};