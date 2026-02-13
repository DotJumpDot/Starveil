export function parseTTL(ttl: string): number {
  if (!ttl || typeof ttl !== 'string') {
    throw new Error('TTL must be a non-empty string');
  }

  const ttlPattern = /^(?:(\d+)([smhdw])\s*)+$/;
  if (!ttlPattern.test(ttl)) {
    throw new Error(`Invalid TTL format: ${ttl}. Expected format like '1h', '30m', '2d', '1h30m'`);
  }

  const unitPatterns = {
    s: /(\d+)s/g,
    m: /(\d+)m/g,
    h: /(\d+)h/g,
    d: /(\d+)d/g,
    w: /(\d+)w/g
  };

  const unitMultipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000
  };

  let totalMs = 0;

  for (const [unit, pattern] of Object.entries(unitPatterns)) {
    const matches = ttl.matchAll(pattern);
    for (const match of matches) {
      const value = parseInt(match[1], 10);
      totalMs += value * unitMultipliers[unit as keyof typeof unitMultipliers];
    }
  }

  return totalMs;
}

export function calculateExpiration(ttl: string): number {
  const ttlMs = parseTTL(ttl);
  return Date.now() + ttlMs;
}

export function isExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

export function formatTTL(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    const remainingDays = days % 7;
    return remainingDays > 0 ? `${weeks}w${remainingDays}d` : `${weeks}w`;
  }
  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d${remainingHours}h` : `${days}d`;
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

export function parseSize(size: string | number): number {
  if (typeof size === 'number') {
    if (isNaN(size) || size <= 0) {
      throw new Error('Size must be a positive number');
    }
    return size;
  }

  if (typeof size !== 'string' || size.trim() === '') {
    throw new Error('Size must be a non-empty string or number');
  }

  const sizePattern = /^(\d+(?:\.\d+)?)\s*(KB|MB|GB|TB|B)$/i;
  const match = size.match(sizePattern);

  if (!match) {
    throw new Error(`Invalid size format: ${size}. Expected format like '10MB', '5GB', '1024B'`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  const unitMultipliers = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };

  return value * unitMultipliers[unit as keyof typeof unitMultipliers];
}
