import { StorageManager, onStorageChange } from './core/storage';
import { calculateExpiration, isExpired, parseSize } from './core/expiration';
import {
  validateKey,
  validateTTL,
  validateValue,
  validateStorageAccess
} from './core/validator';
import type {
  StarveilOptions,
  StarveilSetOptions,
  StarveilGetOptions,
  StarveilStorageItem,
  StarveilExpiredResponse,
  StarveilGetResponse,
  StarveilStorageInfo,
  StarveilEventMap
} from './core/types';

const WARNING_THRESHOLD = 0.8;

export default class Starveil<T = unknown> {
  private storage: StorageManager;
  private options: StarveilInternalOptions;
  private eventHandlers: Map<keyof StarveilEventMap, Set<Function>>;

  constructor(options: StarveilOptions = {}) {
    validateStorageAccess();

    this.options = {
      namespace: options.namespace || null,
      defaultTTL: options.defaultTTL || null,
      maxSize: options.maxSize || 5 * 1024 * 1024
    };

    this.storage = new StorageManager(this.options);
    this.eventHandlers = new Map([
      ['expired', new Set()],
      ['warning', new Set()],
      ['full', new Set()]
    ]);

    this.setupCleanupInterval();
    this.setupCrossTabSync();
  }

  set(key: string, value: T, options: StarveilSetOptions = {}): boolean {
    validateKey(key);
    validateValue(value);

    const ttl = options.ttl || this.options.defaultTTL;
    if (!ttl) {
      throw new Error('TTL is required. Provide it in options or set defaultTTL in constructor.');
    }

    validateTTL(ttl);

    const expiresAt = calculateExpiration(ttl);
    const serializedValue = JSON.stringify(value);
    const size = new Blob([serializedValue]).size;

    const item: StarveilStorageItem<T> = {
      value,
      expiresAt,
      ttl,
      size,
      createdAt: Date.now()
    };

    const itemSize = new Blob([JSON.stringify(item)]).size;

    try {
      this.checkStorageSpace(itemSize);
      this.storage.set(key, item);
      this.checkWarningThreshold();
      return true;
    } catch (error) {
      this.cleanupAndRetry(key, item);
      this.checkWarningThreshold();
      return true;
    }
  }

  get(key: string, options: StarveilGetOptions = {}): StarveilGetResponse<T> {
    validateKey(key);

    const item = this.storage.get<T>(key);

    if (!item) {
      return null;
    }

    if (isExpired(item.expiresAt)) {
      this.storage.remove(key);
      this.emit('expired', key, item.value);

      return {
        starveilInfo: 'expired',
        starveilStatus: false
      } as StarveilExpiredResponse;
    }

    if (options.includeMeta) {
      return {
        value: item.value,
        expiresAt: item.expiresAt,
        ttl: item.ttl,
        size: item.size
      } as any;
    }

    return item.value;
  }

  remove(key: string): boolean {
    validateKey(key);

    try {
      this.storage.remove(key);
      return true;
    } catch {
      return false;
    }
  }

  clear(): void {
    this.storage.clear();
  }

  getAll(): Record<string, any> {
    const items = this.storage.getAllItems();
    const result: Record<string, any> = {};

    for (const [key, item] of items.entries()) {
      if (isExpired(item.expiresAt)) {
        this.storage.remove(key);
        this.emit('expired', key, item.value);
      } else {
        result[key] = {
          value: item.value,
          expiresAt: item.expiresAt,
          ttl: item.ttl,
          size: item.size
        };
      }
    }

    return result;
  }

  getInfo(): StarveilStorageInfo {
    const usedSpace = this.storage.getUsedSpace();
    const itemCount = this.storage.getItemCount();
    const freeSpace = this.options.maxSize - usedSpace;

    return {
      usedSpace,
      freeSpace: Math.max(0, freeSpace),
      itemCount,
      maxSize: this.options.maxSize
    };
  }

  setMaxSize(size: string | number): void {
    this.options.maxSize = parseSize(size);
    this.storage.setMaxSize(this.options.maxSize);
  }

  on<K extends keyof StarveilEventMap>(
    event: K,
    callback: StarveilEventMap[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.add(callback as Function);
    }
  }

  off<K extends keyof StarveilEventMap>(
    event: K,
    callback: StarveilEventMap[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(callback as Function);
    }
  }

  private emit<K extends keyof StarveilEventMap>(
    event: K,
    ...args: Parameters<StarveilEventMap[K]>
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          (handler as Function)(...args);
        } catch {
          return;
        }
      });
    }
  }

  private checkStorageSpace(itemSize: number): void {
    const info = this.getInfo();
    const availableSpace = info.freeSpace;

    if (availableSpace >= itemSize) {
      this.checkWarningThreshold();
      return;
    }

    this.checkWarningThreshold();

    const requiredSpace = itemSize - availableSpace;
    const items = this.storage.getAllItems();
    const sortedItems = Array.from(items.entries()).sort(
      (a, b) => a[1].createdAt - b[1].createdAt
    );

    let freedSpace = 0;
    let removedCount = 0;

    for (const [key] of sortedItems) {
      const item = items.get(key);
      if (item) {
        this.storage.remove(key);
        freedSpace += item.size;
        removedCount++;

        if (freedSpace >= requiredSpace) {
          break;
        }
      }
    }

    const newInfo = this.getInfo();
    if (newInfo.freeSpace < itemSize) {
      this.emit('full');
      throw new Error('Storage is full and cannot accommodate new item');
    }
  }

  private cleanupAndRetry(key: string, item: StarveilStorageItem<T>): void {
    this.storage.removeExpiredItems();
    this.checkWarningThreshold();

    try {
      this.storage.set(key, item);
    } catch {
      const itemCount = this.storage.getItemCount();
      const itemsToRemove = Math.max(1, Math.floor(itemCount * 0.1));
      this.storage.removeOldestItems(itemsToRemove);

      try {
        this.storage.set(key, item);
      } catch {
        this.checkWarningThreshold();
        this.emit('full');
        throw new Error('Unable to store item: storage is full');
      }
    }
  }

  private setupCleanupInterval(): void {
    const interval = setInterval(() => {
      const expiredKeys = this.storage.removeExpiredItems();
      expiredKeys.forEach((key) => {
        const item = this.storage.get(key);
        if (item) {
          this.emit('expired', key, item.value);
        }
      });

      this.checkWarningThreshold();
    }, 60000);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        clearInterval(interval);
      });
    }
  }

  private checkWarningThreshold(): void {
    const info = this.getInfo();
    const usageRatio = info.usedSpace / info.maxSize;

    if (usageRatio >= WARNING_THRESHOLD) {
      this.emit('warning', `Storage is ${(usageRatio * 100).toFixed(0)}% full`);
    }
  }

  private setupCrossTabSync(): void {
    if (typeof window === 'undefined') return;

    onStorageChange((key, newValue) => {
      if (this.options.namespace && !key.startsWith(`${this.options.namespace}:`)) {
        return;
      }

      if (newValue === null) {
        const originalKey = this.options.namespace
          ? key.replace(`${this.options.namespace}:`, '')
          : key;
        this.emit('expired', originalKey, null);
      }
    });
  }
}

interface StarveilInternalOptions {
  namespace: string | null;
  defaultTTL: string | null;
  maxSize: number;
}
