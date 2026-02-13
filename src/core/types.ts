export interface StarveilOptions {
  namespace?: string;
  defaultTTL?: string;
  maxSize?: number;
}

export interface StarveilSetOptions {
  ttl?: string;
}

export interface StarveilGetOptions {
  includeMeta?: boolean;
}

export interface StarveilStorageItem<T = unknown> {
  value: T;
  expiresAt: number;
  ttl: string;
  size: number;
  createdAt: number;
}

export interface StarveilMetadata {
  value: unknown;
  expiresAt: number;
  ttl: string;
  size: number;
}

export interface StarveilExpiredResponse {
  starveilInfo: 'expired';
  starveilStatus: false;
}

export type StarveilGetResponse<T = unknown> = T | StarveilExpiredResponse | null;

export interface StarveilStorageInfo {
  usedSpace: number;
  freeSpace: number;
  itemCount: number;
  maxSize: number;
}

export type StarveilEventType = 'expired' | 'warning' | 'full';

export type StarveilEventHandler = (key: string, value: unknown, ...args: unknown[]) => void;

export interface StarveilEventMap {
  expired: (key: string, value: unknown) => void;
  warning: (message: string) => void;
  full: () => void;
}

export interface StarveilStoredData<T = unknown> {
  value: T;
  expiresAt: number;
  ttl: string;
  createdAt: number;
}

export interface StarveilInternalOptions {
  namespace: string | null;
  defaultTTL: string | null;
  maxSize: number;
}
