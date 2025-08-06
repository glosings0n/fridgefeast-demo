"use client";

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
        try {
            const serializedState = JSON.stringify(storedValue);
            window.localStorage.setItem(key, serializedState);
        } catch (error) {
            console.error('Error saving state to localStorage:', error);
        }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
