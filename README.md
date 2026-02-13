<div align="center">

  <h1>Starveil ✨</h1>

  <p>A powerful localStorage management library with built-in expiration, namespace support, and advanced features for web applications.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![npm version](https://badge.fury.io/js/starveil.svg)](https://www.npmjs.com/package/starveil)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-43853D.svg)](https://nodejs.org/)
  [![Zero Dependencies](https://img.shields.io/badge/Zero%20Dependencies-2ecc71.svg)](https://github.com/dotjumpdot/starveil)

**Version 1.1.0 - Production Release** 🎉

  [View on npmjs.com](https://www.npmjs.com/package/starveil)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## About

Starveil is a lightweight, zero-dependency localStorage wrapper that enhances browser storage with powerful features like automatic expiration, namespace isolation, size management, and event-driven notifications. Built with TypeScript from the ground up, it provides type-safe storage operations for modern web applications.

---

## Features

<div align="center">

  <table>
    <tr>
      <td align="center" width="20%">
        ⏱️ <br><b>TTL Support</b>
      </td>
      <td align="center" width="20%">
        🏷️ <br><b>Namespace</b>
      </td>
      <td align="center" width="20%">
        📊 <br><b>Size Management</b>
      </td>
      <td align="center" width="20%">
        📡 <br><b>Events</b>
      </td>
      <td align="center" width="20%">
        🔐 <br><b>TypeScript</b>
      </td>
    </tr>
  </table>

</div>

- **TTL Support**: Time-to-live with human-readable format (`'1h'`, `'30m'`, `'2d'`, `'1w'`)
- **Namespace**: Optional prefix to avoid key collisions across applications
- **Size Management**: Auto-cleanup oldest items when storage is full
- **Custom Response**: `{ starveilInfo: 'expired', starveilStatus: false }` for expired data
- **Events**: `expired`, `warning`, `full` events for reactive programming
- **TypeScript Support**: Full type definitions and generic types included
- **Cross-Tab Sync**: Synchronize storage changes across browser tabs
- **Metadata Access**: Get expiration time, TTL, and storage info
- **Validation**: Built-in data validation before storage
- **Zero Dependencies**: Pure TypeScript implementation, no external dependencies

---

## Installation

```bash
npm install starveil
# or
yarn add starveil
# or
pnpm add starveil
# or
bun add starveil
```

---

## Quick Start

### Usage Examples

```javascript
import Starveil from 'starveil';

// 1. Default settings (namespace='Starveil', no expiration)
const storage = new Starveil();

// 2. String argument (namespace='myapp', no expiration)
const storage = new Starveil('myapp');

// 3. Options with name and expire (new API)
const storage = new Starveil({
  name: 'myapp',
  expire: '1h'
});

// 4. Backward compatible with namespace and defaultTTL
const storage = new Starveil({
  namespace: 'myapp',
  defaultTTL: '1h'
});

storage.set('user', { id: 1, name: 'John' });
const user = storage.get('user');
console.log(user);
```

### TypeScript

```typescript
import Starveil from 'starveil';

interface User {
  id: number;
  name: string;
}

const storage = new Starveil<User>({
  name: 'myapp',
  expire: '1h'
});

const user: User = storage.get('user');
console.log(user.name);
```

---

## API Reference

### Constructor

```typescript
new Starveil<T = any>(optionsOrNamespace?: StarveilOptions | string)
```

**Constructor Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `namespace` | `string` | `null` | Prefix for all keys to avoid collisions (backward compatible) |
| `name` | `string` | `null` | Alias for namespace (new API) |
| `defaultTTL` | `string` | `null` | Default time-to-live for all items (backward compatible) |
| `expire` | `string` | `null` | Alias for defaultTTL (new API) |
| `maxSize` | `number` | `5242880` | Maximum storage size in bytes (5MB) |

**Usage Examples:**

```javascript
// 1. Default: namespace='Starveil', no expiration
const storage = new Starveil();

// 2. String argument: namespace='myapp', no expiration
const storage = new Starveil('myapp');

// 3. New API with name and expire
const storage = new Starveil({
  name: 'myapp',
  expire: '1h'
});

// 4. Backward compatible
const storage = new Starveil({
  namespace: 'myapp',
  defaultTTL: '1h'
});
```

### Methods

#### `set(key, value, options?)`

Store data with optional TTL.

```javascript
storage.set('user', { id: 1, name: 'John' }, { ttl: '1h' });
```

**Parameters:**
- `key` (string): Storage key
- `value` (any): Data to store
- `options` (object, optional):
  - `ttl` (string): Time-to-live (e.g., `'1h'`, `'30m'`, `'2d'`)

**Returns:** `boolean` - Success status

---

#### `get(key, options?)`

Retrieve data from storage.

```javascript
const user = storage.get('user');
```

**Parameters:**
- `key` (string): Storage key
- `options` (object, optional):
  - `includeMeta` (boolean): Include metadata in response

**Returns:** Data value or expired response

**Expired Response:**
```javascript
{
  starveilInfo: 'expired',
  starveilStatus: false
}
```

**Response with Metadata:**
```javascript
{
  value: { id: 1, name: 'John' },
  expiresAt: 1737369600000,
  ttl: '1h',
  size: 156
}
```

---

#### `remove(key)`

Remove a specific key.

```javascript
storage.remove('user');
```

**Parameters:**
- `key` (string): Storage key

**Returns:** `boolean` - Success status

---

#### `clear()`

Remove all items from storage.

```javascript
storage.clear();
```

**Returns:** `void`

---

#### `getAll()`

Get all items from storage.

```javascript
const all = storage.getAll();
console.log(all);
```

**Returns:** Object with all items and metadata

```javascript
{
  'user': {
    value: { id: 1, name: 'John' },
    expiresAt: 1737369600000,
    ttl: '1h',
    size: 156
  }
}
```

---

#### `getInfo()`

Get storage information.

```javascript
const info = storage.getInfo();
console.log(info);
```

**Returns:** Storage information

```javascript
{
  usedSpace: 1024,
  freeSpace: 5241856,
  itemCount: 2,
  maxSize: 5242880
}
```

---

#### `on(event, callback)`

Register an event listener.

```javascript
storage.on('expired', (key, value) => {
  console.log(`${key} expired with value:`, value);
});
```

**Parameters:**
- `event` (string): Event name (`'expired'`, `'warning'`, `'full'`)
- `callback` (function): Event handler function

**Returns:** `void`

---

#### `off(event, callback)`

Remove an event listener.

```javascript
storage.off('expired', callback);
```

**Parameters:**
- `event` (string): Event name
- `callback` (function): Event handler function

**Returns:** `void`

---

## Usage Examples

### Basic Storage

```javascript
import Starveil from 'starveil';

const storage = new Starveil();

storage.set('user', { id: 1, name: 'John' });
const user = storage.get('user');
console.log(user);
```

### TTL (Time-To-Live)

```javascript
storage.set('cache', data, { ttl: '30m' });
storage.set('session', token, { ttl: '1h' });
storage.set('persistent', data, { ttl: '1d' });
```

### TTL Formats

- `'1s'` - 1 second
- `'1m'` - 1 minute
- `'1h'` - 1 hour
- `'1d'` - 1 day
- `'1w'` - 1 week
- `'2h30m'` - 2 hours and 30 minutes
- `'1d12h'` - 1 day and 12 hours

### Namespace

```javascript
const app1 = new Starveil({ namespace: 'app1' });
const app2 = new Starveil({ namespace: 'app2' });

app1.set('user', { id: 1 });
app2.set('user', { id: 2 });

app1.get('user'); // { id: 1 }
app2.get('user'); // { id: 2 }

// Keys are stored as:
// 'app1:user' and 'app2:user'
```

### Expired Data Handling

```javascript
storage.set('temp', data, { ttl: '10s' });

setTimeout(() => {
  const expired = storage.get('temp');
  console.log(expired);
  // Output:
  // {
  //   starveilInfo: 'expired',
  //   starveilStatus: false
  // }
}, 11000);
```

### Event System

```javascript
storage.on('expired', (key, value) => {
  console.log(`${key} expired:`, value);
});

storage.on('warning', (message) => {
  console.log('Storage warning:', message);
  // Output: "Storage is 80% full. Consider cleaning up old data."
});

storage.on('full', () => {
  console.log('Storage is full!');
});
```

### Metadata Access

```javascript
storage.set('user', { id: 1 }, { ttl: '1h' });

const withMeta = storage.get('user', { includeMeta: true });
console.log(withMeta);

// Output:
// {
//   value: { id: 1 },
//   expiresAt: 1737369600000,
//   ttl: '1h',
//   size: 156
// }
```

### Storage Information

```javascript
const info = storage.getInfo();
console.log(`Used: ${info.usedSpace} bytes`);
console.log(`Free: ${info.freeSpace} bytes`);
console.log(`Items: ${info.itemCount}`);
console.log(`Max Size: ${info.maxSize} bytes`);
```

### Clear All Data

```javascript
storage.clear();
```

### TypeScript Generic Types

```typescript
import Starveil from 'starveil';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Config {
  theme: 'light' | 'dark';
  language: string;
}

const userStorage = new Starveil<User>();
const configStorage = new Starveil<Config>();

const user: User = userStorage.get('user');
const config: Config = configStorage.get('config');
```

---

## Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |

---

## Contributing

Contributions are welcome! Please see [AGENTS.md](AGENTS.md) for guidelines.

### Development Setup

```bash
git clone https://github.com/dotjumpdot/starveil.git
cd starveil
bun install
```

### Development Commands

```bash
bun run build          # Build TypeScript
bun run test           # Run tests
bun run test:watch     # Run tests in watch mode
bun run test:coverage  # Run tests with coverage
```

---

## License

MIT License - Copyright (c) 2026 [DotJumpDot](https://github.com/dotjumpdot)

---

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## Support

- GitHub Issues: [Report a bug](https://github.com/dotjumpdot/starveil/issues)
- Documentation: [Full API Reference](https://github.com/dotjumpdot/starveil)
- npm Package: [starveil](https://www.npmjs.com/package/starveil)

---

<div align="center">

  <b>Made with ❤️ by DotJumpDot</b>

  [⬆ Back to Top](#starveil-)

</div>
