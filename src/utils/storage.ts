// src/utils/storage.ts
export function saveToStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage<T>(key: string, fallback: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    try {
        return JSON.parse(stored);
    } catch {
        return fallback;
    }
}