/**
 * Service for managing local storage operations
 * Provides type-safe storage with error handling and data validation
 */
export class StorageService {
  private readonly prefix: string;

  constructor(prefix = 'doctrack') {
    this.prefix = prefix;
  }

  /**
   * Generate a prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}-${key}`;
  }

  /**
   * Check if localStorage is available
   */
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Store a value in localStorage
   */
  setItem<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
      return true;
    } catch (error) {
      console.error('Failed to store item in localStorage:', error);
      return false;
    }
  }

  /**
   * Retrieve a value from localStorage
   */
  getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isStorageAvailable()) {
      return defaultValue || null;
    }

    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue || null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Failed to retrieve item from localStorage:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Failed to remove item from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all items with the current prefix
   */
  clear(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${this.prefix}-`)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  hasItem(key: string): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Get all keys with the current prefix
   */
  getKeys(): string[] {
    if (!this.isStorageAvailable()) {
      return [];
    }

    const keys: string[] = [];
    const prefixWithDash = `${this.prefix}-`;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithDash)) {
          keys.push(key.substring(prefixWithDash.length));
        }
      }
    } catch (error) {
      console.error('Failed to get keys from localStorage:', error);
    }

    return keys;
  }

  /**
   * Get the size of stored data in bytes (approximate)
   */
  getStorageSize(): number {
    if (!this.isStorageAvailable()) {
      return 0;
    }

    let totalSize = 0;
    const prefixWithDash = `${this.prefix}-`;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithDash)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
    }

    return totalSize;
  }

  /**
   * Store data with expiration
   */
  setItemWithExpiry<T>(key: string, value: T, expiryInMinutes: number): boolean {
    const now = new Date();
    const expiryTime = now.getTime() + (expiryInMinutes * 60 * 1000);
    
    const itemWithExpiry = {
      value,
      expiry: expiryTime
    };

    return this.setItem(key, itemWithExpiry);
  }

  /**
   * Get data with expiration check
   */
  getItemWithExpiry<T>(key: string, defaultValue?: T): T | null {
    const item = this.getItem<{ value: T; expiry: number }>(key);
    
    if (!item) {
      return defaultValue || null;
    }

    const now = new Date();
    if (now.getTime() > item.expiry) {
      this.removeItem(key);
      return defaultValue || null;
    }

    return item.value;
  }

  /**
   * Store user preferences
   */
  setUserPreference<T>(userId: string, key: string, value: T): boolean {
    return this.setItem(`user-${userId}-${key}`, value);
  }

  /**
   * Get user preferences
   */
  getUserPreference<T>(userId: string, key: string, defaultValue?: T): T | null {
    return this.getItem(`user-${userId}-${key}`, defaultValue);
  }

  /**
   * Store application state
   */
  setAppState<T>(key: string, value: T): boolean {
    return this.setItem(`app-state-${key}`, value);
  }

  /**
   * Get application state
   */
  getAppState<T>(key: string, defaultValue?: T): T | null {
    return this.getItem(`app-state-${key}`, defaultValue);
  }

  /**
   * Store cache data with TTL
   */
  setCache<T>(key: string, value: T, ttlInMinutes = 60): boolean {
    return this.setItemWithExpiry(`cache-${key}`, value, ttlInMinutes);
  }

  /**
   * Get cache data
   */
  getCache<T>(key: string, defaultValue?: T): T | null {
    return this.getItemWithExpiry(`cache-${key}`, defaultValue);
  }

  /**
   * Clear all cache data
   */
  clearCache(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const keysToRemove: string[] = [];
      const cachePrefix = `${this.prefix}-cache-`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(cachePrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Failed to clear cache:', error);
      return false;
    }
  }

  /**
   * Export all data for backup
   */
  exportData(): Record<string, any> | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    const data: Record<string, any> = {};
    const prefixWithDash = `${this.prefix}-`;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefixWithDash)) {
          const value = localStorage.getItem(key);
          if (value) {
            const cleanKey = key.substring(prefixWithDash.length);
            try {
              data[cleanKey] = JSON.parse(value);
            } catch {
              data[cleanKey] = value;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }

    return data;
  }

  /**
   * Import data from backup
   */
  importData(data: Record<string, any>): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      Object.entries(data).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService(); 