export function validateKey(key: unknown): void {
  if (typeof key !== 'string') {
    throw new TypeError('Key must be a string');
  }
  if (key.length === 0) {
    throw new Error('Key cannot be empty');
  }
  if (key.includes('\x00')) {
    throw new Error('Key cannot contain null character');
  }
}

export function validateTTL(ttl: unknown): void {
  if (ttl !== undefined && ttl !== null) {
    if (typeof ttl !== 'string') {
      throw new TypeError('TTL must be a string');
    }
    if (ttl.length === 0) {
      throw new Error('TTL cannot be empty');
    }
  }
}

export function validateMaxSize(maxSize: unknown): void {
  if (typeof maxSize !== 'number') {
    throw new TypeError('Max size must be a number');
  }
  if (maxSize <= 0) {
    throw new Error('Max size must be greater than 0');
  }
  if (!Number.isFinite(maxSize)) {
    throw new Error('Max size must be a finite number');
  }
}

export function validateValue(value: unknown): void {
  if (value === undefined) {
    throw new Error('Value cannot be undefined');
  }
}

export function validateStorageAccess(): void {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in this environment');
  }
}

export function validateDataSize(data: string, maxSize: number): void {
  const size = new Blob([data]).size;
  if (size > maxSize) {
    throw new Error(`Data size (${size} bytes) exceeds maximum size (${maxSize} bytes)`);
  }
}

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeKey(key: string): string {
  return key.replace(/[^\w\-]/g, '_');
}
