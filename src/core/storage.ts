import { StarveilStorageItem, StarveilInternalOptions } from './types';

export class StorageManager {
  private namespace: string | null;
  private maxSize: number;

  constructor(options: StarveilInternalOptions) {
    this.namespace = options.namespace || null;
    this.maxSize = options.maxSize;
  }

  getNamespacedKey(key: string): string {
    return this.namespace ? `${this.namespace}:${key}` : key;
  }

  getOriginalKey(namespacedKey: string): string {
    if (!this.namespace) return namespacedKey;
    return namespacedKey.replace(`${this.namespace}:`, '');
  }

  set(key: string, value: StarveilStorageItem): void {
    const namespacedKey = this.getNamespacedKey(key);
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;

    if (size > this.maxSize) {
      throw new Error(`Item size (${size} bytes) exceeds maximum storage size (${this.maxSize} bytes)`);
    }

    localStorage.setItem(namespacedKey, serialized);
  }

  get<T = unknown>(key: string): StarveilStorageItem<T> | null {
    const namespacedKey = this.getNamespacedKey(key);
    const serialized = localStorage.getItem(namespacedKey);

    if (!serialized) return null;

    try {
      return JSON.parse(serialized) as StarveilStorageItem<T>;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    const namespacedKey = this.getNamespacedKey(key);
    const exists = localStorage.getItem(namespacedKey) !== null;
    if (!exists) {
      throw new Error(`Key "${key}" does not exist`);
    }
    localStorage.removeItem(namespacedKey);
  }

  clear(): void {
    if (this.namespace) {
      const keys = this.getAllKeys();
      keys.forEach((key) => {
        localStorage.removeItem(key);
      });
    } else {
      localStorage.clear();
    }
  }

  getAllKeys(): string[] {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        if (!this.namespace || key.startsWith(`${this.namespace}:`)) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  getAllItems<T = unknown>(): Map<string, StarveilStorageItem<T>> {
    const items = new Map<string, StarveilStorageItem<T>>();
    const keys = this.getAllKeys();

    for (const namespacedKey of keys) {
      const serialized = localStorage.getItem(namespacedKey);
      if (serialized) {
        try {
          const item = JSON.parse(serialized) as StarveilStorageItem<T>;
          const originalKey = this.getOriginalKey(namespacedKey);
          items.set(originalKey, item);
        } catch {
          continue;
        }
      }
    }

    return items;
  }

  getUsedSpace(): number {
    let totalSize = 0;
    const keys = this.getAllKeys();

    for (const key of keys) {
      const serialized = localStorage.getItem(key);
      if (serialized) {
        totalSize += new Blob([serialized]).size;
      }
    }

    return totalSize;
  }

  getItemCount(): number {
    return this.getAllKeys().length;
  }

  setMaxSize(size: number): void {
    this.maxSize = size;
  }

  removeOldestItems(count: number): void {
    const items = this.getAllItems();
    const sortedItems = Array.from(items.entries()).sort((a, b) => a[1].createdAt - b[1].createdAt);

    for (let i = 0; i < Math.min(count, sortedItems.length); i++) {
      const [key] = sortedItems[i];
      const namespacedKey = this.getNamespacedKey(key);
      localStorage.removeItem(namespacedKey);
    }
  }

  removeExpiredItems(): string[] {
    const expiredKeys: string[] = [];
    const items = this.getAllItems();

    for (const [key, item] of items.entries()) {
      if (Date.now() >= item.expiresAt) {
        try {
          this.remove(key);
          expiredKeys.push(key);
        } catch {
          continue;
        }
      }
    }

    return expiredKeys;
  }
}

export function onStorageChange(callback: (key: string, value: string | null) => void): () => void {
  const handler = (event: StorageEvent): void => {
    if (event.key) {
      callback(event.key, event.newValue);
    }
  };

  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('storage', handler);
  };
}
