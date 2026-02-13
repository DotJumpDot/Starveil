import Starveil from '../src/starveil';
import { parseTTL, calculateExpiration, isExpired, formatTTL } from '../src/core/expiration';
import { validateKey, validateTTL, validateMaxSize, validateValue } from '../src/core/validator';

describe('Starveil', () => {
  let storage: Starveil;

  beforeEach(() => {
    storage = new Starveil({
      namespace: 'test',
      defaultTTL: '1h',
      maxSize: 1024 * 1024
    });
    localStorage.clear();
  });

  describe('Constructor', () => {
    test('should create instance with default options', () => {
      const s = new Starveil();
      expect(s).toBeInstanceOf(Starveil);
    });

    test('should create instance with custom options', () => {
      const s = new Starveil({
        namespace: 'custom',
        defaultTTL: '2h',
        maxSize: 2048
      });
      expect(s).toBeInstanceOf(Starveil);
    });
  });

  describe('set', () => {
    test('should store data successfully', () => {
      const result = storage.set('user', { id: 1, name: 'John' });
      expect(result).toBe(true);
    });

    test('should store data with custom TTL', () => {
      const result = storage.set('cache', 'data', { ttl: '30m' });
      expect(result).toBe(true);
    });

    test('should throw error for undefined value', () => {
      expect(() => storage.set('key', undefined)).toThrow('Value cannot be undefined');
    });

    test('should throw error for empty key', () => {
      expect(() => storage.set('', 'value')).toThrow('Key cannot be empty');
    });

    test('should throw error for invalid TTL', () => {
      expect(() => storage.set('key', 'value', { ttl: 'invalid' })).toThrow('Invalid TTL format');
    });
  });

  describe('get', () => {
    test('should retrieve stored data', () => {
      storage.set('user', { id: 1, name: 'John' });
      const result = storage.get('user');
      expect(result).toEqual({ id: 1, name: 'John' });
    });

    test('should return null for non-existent key', () => {
      const result = storage.get('nonexistent');
      expect(result).toBeNull();
    });

    test('should return expired response for expired data', () => {
      storage.set('temp', 'data', { ttl: '0s' });
      const result = storage.get('temp');
      expect(result).toEqual({
        starveilInfo: 'expired',
        starveilStatus: false
      });
    });

    test('should include metadata when requested', () => {
      storage.set('user', { id: 1 });
      const result = storage.get('user', { includeMeta: true });
      expect(result).toHaveProperty('value');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('ttl');
      expect(result).toHaveProperty('size');
    });
  });

  describe('remove', () => {
    test('should remove stored data', () => {
      storage.set('user', { id: 1 });
      const result = storage.remove('user');
      expect(result).toBe(true);
      expect(storage.get('user')).toBeNull();
    });

    test('should return false for non-existent key', () => {
      const result = storage.remove('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    test('should clear all data', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });

  describe('getAll', () => {
    test('should return all stored items', () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      const all = storage.getAll();
      expect(all).toHaveProperty('key1');
      expect(all).toHaveProperty('key2');
    });

    test('should not include expired items', () => {
      storage.set('temp', 'data', { ttl: '0s' });
      const all = storage.getAll();
      expect(all).not.toHaveProperty('temp');
    });
  });

  describe('getInfo', () => {
    test('should return storage information', () => {
      storage.set('user', { id: 1 });
      const info = storage.getInfo();
      expect(info).toHaveProperty('usedSpace');
      expect(info).toHaveProperty('freeSpace');
      expect(info).toHaveProperty('itemCount');
      expect(info).toHaveProperty('maxSize');
    });
  });

  describe('Events', () => {
    test('should emit expired event when item expires', (done) => {
      storage.set('temp', 'data', { ttl: '0s' });
      storage.on('expired', (key, value) => {
        expect(key).toBe('temp');
        done();
      });
      setTimeout(() => storage.get('temp'), 100);
    });

    test('should emit warning event when storage is almost full', (done) => {
      const smallStorage = new Starveil({ maxSize: 100, defaultTTL: '1h' });
      smallStorage.on('warning', (message) => {
        expect(message).toContain('Storage is');
        done();
      });
      smallStorage.set('key1', 'a'.repeat(50));
      smallStorage.set('key2', 'a'.repeat(35));
    });

    test('should remove event listeners', () => {
      const handler = jest.fn();
      storage.on('expired', handler);
      storage.off('expired', handler);
      storage.set('temp', 'data', { ttl: '0s' });
      storage.get('temp');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Namespace', () => {
    test('should use namespace for keys', () => {
      const ns1 = new Starveil({ namespace: 'app1', defaultTTL: '1h' });
      const ns2 = new Starveil({ namespace: 'app2', defaultTTL: '1h' });
      
      ns1.set('user', { id: 1 });
      ns2.set('user', { id: 2 });
      
      expect(ns1.get('user')).toEqual({ id: 1 });
      expect(ns2.get('user')).toEqual({ id: 2 });
    });

    test('should not clear other namespaces', () => {
      const ns1 = new Starveil({ namespace: 'app1', defaultTTL: '1h' });
      const ns2 = new Starveil({ namespace: 'app2', defaultTTL: '1h' });
      
      ns1.set('key1', 'value1');
      ns2.set('key2', 'value2');
      ns1.clear();
      
      expect(ns1.get('key1')).toBeNull();
      expect(ns2.get('key2')).toEqual('value2');
    });
  });
});

describe('Expiration Utilities', () => {
  describe('parseTTL', () => {
    test('should parse seconds', () => {
      expect(parseTTL('1s')).toBe(1000);
      expect(parseTTL('30s')).toBe(30000);
    });

    test('should parse minutes', () => {
      expect(parseTTL('1m')).toBe(60000);
      expect(parseTTL('30m')).toBe(1800000);
    });

    test('should parse hours', () => {
      expect(parseTTL('1h')).toBe(3600000);
      expect(parseTTL('2h')).toBe(7200000);
    });

    test('should parse days', () => {
      expect(parseTTL('1d')).toBe(86400000);
      expect(parseTTL('2d')).toBe(172800000);
    });

    test('should parse weeks', () => {
      expect(parseTTL('1w')).toBe(604800000);
    });

    test('should parse combined units', () => {
      expect(parseTTL('1h30m')).toBe(5400000);
      expect(parseTTL('1d12h')).toBe(129600000);
      expect(parseTTL('2h30m45s')).toBe(9045000);
    });

    test('should throw error for invalid format', () => {
      expect(() => parseTTL('invalid')).toThrow('Invalid TTL format');
      expect(() => parseTTL('')).toThrow('TTL must be a non-empty string');
    });
  });

  describe('calculateExpiration', () => {
    test('should calculate expiration timestamp', () => {
      const now = Date.now();
      const expiration = calculateExpiration('1h');
      expect(expiration).toBeGreaterThanOrEqual(now + 3600000 - 1000);
      expect(expiration).toBeLessThanOrEqual(now + 3600000 + 1000);
    });
  });

  describe('isExpired', () => {
    test('should identify expired items', () => {
      const past = Date.now() - 1000;
      expect(isExpired(past)).toBe(true);
    });

    test('should identify non-expired items', () => {
      const future = Date.now() + 3600000;
      expect(isExpired(future)).toBe(false);
    });

    test('should identify exactly expired items', () => {
      const now = Date.now();
      expect(isExpired(now)).toBe(true);
    });
  });

  describe('formatTTL', () => {
    test('should format seconds', () => {
      expect(formatTTL(1000)).toBe('1s');
      expect(formatTTL(30000)).toBe('30s');
    });

    test('should format minutes', () => {
      expect(formatTTL(60000)).toBe('1m');
      expect(formatTTL(1800000)).toBe('30m');
    });

    test('should format hours', () => {
      expect(formatTTL(3600000)).toBe('1h');
      expect(formatTTL(5400000)).toBe('1h30m');
    });

    test('should format days', () => {
      expect(formatTTL(86400000)).toBe('1d');
      expect(formatTTL(129600000)).toBe('1d12h');
    });
  });
});

describe('Validator Utilities', () => {
  describe('validateKey', () => {
    test('should accept valid keys', () => {
      expect(() => validateKey('valid')).not.toThrow();
      expect(() => validateKey('valid-key')).not.toThrow();
      expect(() => validateKey('valid_key')).not.toThrow();
    });

    test('should reject non-string keys', () => {
      expect(() => validateKey(123)).toThrow('Key must be a string');
      expect(() => validateKey(null)).toThrow('Key must be a string');
    });

    test('should reject empty keys', () => {
      expect(() => validateKey('')).toThrow('Key cannot be empty');
    });
  });

  describe('validateTTL', () => {
    test('should accept valid TTL', () => {
      expect(() => validateTTL('1h')).not.toThrow();
      expect(() => validateTTL('30m')).not.toThrow();
    });

    test('should accept undefined TTL', () => {
      expect(() => validateTTL(undefined)).not.toThrow();
    });

    test('should reject non-string TTL', () => {
      expect(() => validateTTL(123)).toThrow('TTL must be a string');
    });
  });

  describe('validateMaxSize', () => {
    test('should accept valid max size', () => {
      expect(() => validateMaxSize(1024)).not.toThrow();
    });

    test('should reject non-number max size', () => {
      expect(() => validateMaxSize('1024')).toThrow('Max size must be a number');
    });

    test('should reject zero max size', () => {
      expect(() => validateMaxSize(0)).toThrow('Max size must be greater than 0');
    });

    test('should reject negative max size', () => {
      expect(() => validateMaxSize(-100)).toThrow('Max size must be greater than 0');
    });
  });

  describe('validateValue', () => {
    test('should accept valid values', () => {
      expect(() => validateValue('string')).not.toThrow();
      expect(() => validateValue(123)).not.toThrow();
      expect(() => validateValue({})).not.toThrow();
      expect(() => validateValue([])).not.toThrow();
      expect(() => validateValue(null)).not.toThrow();
    });

    test('should reject undefined values', () => {
      expect(() => validateValue(undefined)).toThrow('Value cannot be undefined');
    });
  });
});
