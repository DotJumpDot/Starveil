<div align="center">

  <h1>Starveil ✨</h1>

  <p>A powerful localStorage management library with built-in expiration, namespace support, and advanced features for web applications.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![npm version](https://badge.fury.io/js/starveil.svg)](https://www.npmjs.com/package/starveil)
  [![Downloads](https://img.shields.io/npm/dm/staveil)](https://www.npmjs.com/package/starveil)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-3178C6.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-43853D.svg)](https://nodejs.org/)
  [![Zero Dependencies](https://img.shields.io/badge/Zero%20Dependencies-2ecc71.svg)](https://github.com/dotjumpdot/starveil)

**Version 1.1.1 - Production Release** 🎉

  [View on npmjs.com](https://www.npmjs.com/package/starveil)

</div>

---

## Table of Contents
- [Table of Contents](#table-of-contents)
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Usage Examples](#usage-examples)
  - [Interface include](#interface-include)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [TTL Formats](#ttl-formats)
  - [Namespace](#namespace)
- [Browser Compatibility](#browser-compatibility)
  - [Methods](#methods)
    - [`set()`](#set)
    - [`get()`](#get)
    - [`remove()`](#remove)
    - [`clear()`](#clear)
    - [`getAll()`](#getall)
    - [`getInfo()`](#getinfo)
    - [`setMaxSize()`](#setmaxsize)
    - [`on()`](#on)
    - [`off()`](#off)
- [Contributing](#contributing)
  - [Development Setup](#development-setup)
  - [Development Commands](#development-commands)
- [License](#license)
- [Changelog](#changelog)
- [Support](#support)

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

### Interface include

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

---

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

---

## Browser Compatibility

| Browser | Minimum Version |
|---------|-----------------|
| Chrome  | 90+ |
| Firefox | 88+ |
| Safari  | 14+ |
| Edge    | 90+ |

---

### Methods

| Method | Description |
|--------|-------------|
| [`set()`](#set) | Store data with optional TTL |
| [`get()`](#get) | Retrieve data from storage |
| [`remove()`](#remove) | Remove a specific key |
| [`clear()`](#clear) | Remove all items from storage |
| [`getAll()`](#getall) | Get all items from storage |
| [`getInfo()`](#getinfo) | Get storage information |
| [`setMaxSize()`](#setmaxsize) | Set maximum storage size |
| [`on()`](#on) | Register event listeners |
| [`off()`](#off) | Remove event listeners |

---

#### `set()`

Store data with optional time-to-live (TTL).

**Basic Usage:**
```javascript
storage.set('key', 'value');
storage.set('user', { id: 1, name: 'John' });
storage.set('config', { theme: 'dark' }, { ttl: '1h' });
```

**Parameters:**
- `key` (string): Storage key
- `value` (any): Data to store
- `options` (object, optional):
  - `ttl` (string): Time-to-live (e.g., `'1h'`, `'30m'`, `'2d'`)

**Returns:** `boolean` - Success status

**Real-life Example - Session Token:**
```javascript
const storage = new Starveil();

// Store user session that expires in 2 hours
const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

storage.set('session', sessionToken, { ttl: '2h' });

// Later retrieve the session
const token = storage.get('session');
if (token) {
  console.log('User is logged in');
} else {
  console.log('Session expired');
}
```

**Real-life Example - Shopping Cart:**
```javascript
const cart = {
  items: [
    { id: 1, name: 'Product A', price: 29.99, quantity: 2 },
    { id: 2, name: 'Product B', price: 49.99, quantity: 1 }
  ],
  total: 109.97
};

// Cart expires in 24 hours (abandoned cart)
storage.set('cart', cart, { ttl: '1d' });

// Check if cart still exists
const savedCart = storage.get('cart');
if (savedCart) {
  displayCart(savedCart);
} else {
  showEmptyCartMessage();
}
```

---

#### `get()`

Retrieve data from storage. Optionally include metadata.

**Basic Usage:**
```javascript
const value = storage.get('key');
const withMeta = storage.get('key', { includeMeta: true });
```

**Parameters:**
- `key` (string): Storage key
- `options` (object, optional):
  - `includeMeta` (boolean): Include metadata in response

**Returns:** Data value, expired response, or metadata object

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

**Real-life Example - Countdown Timer:**
```javascript
const session = storage.get('session', { includeMeta: true });

if (session?.expiresAt) {
  const timeLeft = session.expiresAt - Date.now();
  const minutesLeft = Math.floor(timeLeft / 1000 / 60);

  console.log(`Session expires in ${minutesLeft} minutes`);

  if (minutesLeft < 5) {
    console.warn('Session expiring soon!');
    showRenewSessionDialog();
  }
}
```

**Real-life Example - Cache Validation:**
```javascript
const cacheData = storage.get('api-data', { includeMeta: true });

if (cacheData) {
  const age = Date.now() - (cacheData.expiresAt || 0);
  const ageInMinutes = Math.abs(age) / 1000 / 60;

  if (ageInMinutes > 30) {
    console.log('Cache is too old, refreshing...');
    fetchFreshData();
  } else {
    console.log(`Using cache (${ageInMinutes.toFixed(0)} min old)`);
    renderData(cacheData.value);
  }
}
```

---

#### `remove()`

Remove a specific key from storage.

**Basic Usage:**
```javascript
storage.remove('user');
storage.remove('session');
```

**Parameters:**
- `key` (string): Storage key

**Returns:** `boolean` - Success status

**Real-life Example - User Logout:**
```javascript
function logout() {
  storage.remove('session');
  storage.remove('user');
  storage.remove('preferences');
  window.location.href = '/login';
}

// Call when user clicks logout
document.getElementById('logout-btn').addEventListener('click', logout);
```

**Real-life Example - Clear Specific Cache:**
```javascript
function clearUserData() {
  const keysToRemove = ['user', 'cart', 'wishlist', 'recently-viewed'];
  keysToRemove.forEach(key => storage.remove(key));
  console.log('User data cleared');
}
```

---

#### `clear()`

Remove all items from storage in the current namespace.

**Basic Usage:**
```javascript
storage.clear();
```

**Returns:** `void`

**Real-life Example - Reset App:**
```javascript
function factoryReset() {
  if (confirm('This will delete all your data. Continue?')) {
    storage.clear();
    console.log('All data cleared');
    window.location.reload();
  }
}

document.getElementById('reset-btn').addEventListener('click', factoryReset);
```

**Real-life Example - Clear on Logout:**
```javascript
function logout() {
  storage.clear();
  showNotification('Logged out successfully');
  navigateToLogin();
}
```

---

#### `getAll()`

Get all items from storage with their metadata.

**Basic Usage:**
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
  },
  'cart': {
    value: { items: [], total: 0 },
    expiresAt: 1737369600000,
    ttl: '1d',
    size: 89
  }
}
```

**Real-life Example - Debug Dashboard:**
```javascript
function showDebugInfo() {
  const allData = storage.getAll();
  console.table(allData);

  const totalSize = Object.values(allData).reduce((sum, item) => sum + item.size, 0);
  const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
  const itemCount = Object.keys(allData).length;

  console.log(`Storage: ${itemCount} items, ${sizeMB}MB total`);
}

showDebugInfo();
```

**Real-life Example - Export Data:**
```javascript
function exportUserData() {
  const allData = storage.getAll();
  const exportData = {
    exportedAt: new Date().toISOString(),
    data: {}
  };

  for (const [key, item] of Object.entries(allData)) {
    exportData.data[key] = item.value;
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starveil-export.json';
  a.click();
}

exportUserData();
```

---

#### `getInfo()`

Get storage statistics and usage information.

**Basic Usage:**
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

**Real-life Example - Storage Health Monitor:**
```javascript
function checkStorageHealth() {
  const info = storage.getInfo();
  const usagePercent = ((info.usedSpace / info.maxSize) * 100).toFixed(1);
  const usedMB = (info.usedSpace / 1024 / 1024).toFixed(2);
  const freeMB = (info.freeSpace / 1024 / 1024).toFixed(2);

  console.log(`Storage: ${usedMB}MB used / ${freeMB}MB free (${usagePercent}%)`);

  if (parseFloat(usagePercent) > 80) {
    console.warn('Storage nearly full!');
    suggestCleanup();
  }
}

setInterval(checkStorageHealth, 60000);
```

**Real-life Example - Storage Quota Warning:**
```javascript
function showStorageUsage() {
  const info = storage.getInfo();
  const usagePercent = Math.floor((info.usedSpace / info.maxSize) * 100);

  const element = document.getElementById('storage-indicator');
  element.textContent = `${usagePercent}% storage used`;

  if (usagePercent < 50) {
    element.style.color = 'green';
  } else if (usagePercent < 80) {
    element.style.color = 'orange';
  } else {
    element.style.color = 'red';
    element.textContent += ' - Consider cleaning up';
  }
}

showStorageUsage();
```

---

#### `setMaxSize()`

Set maximum storage size dynamically. Accepts number or human-readable string.

**Basic Usage:**
```javascript
storage.setMaxSize(10 * 1024 * 1024);
storage.setMaxSize('10MB');
storage.setMaxSize('1GB');
storage.setMaxSize('512KB');
```

**Parameters:**
- `size` (number | string): Maximum size in bytes or human-readable format

**Returns:** `void`

**Real-life Example - User Preference:**
```javascript
const storageSettings = document.getElementById('storage-settings');

storageSettings.addEventListener('change', (e) => {
  const sizeMB = parseInt(e.target.value);
  storage.setMaxSize(`${sizeMB}MB`);
  console.log(`Storage limit set to ${sizeMB}MB`);
});
```

**Real-life Example - Dynamic Quota:**
```javascript
function applyStorageQuota(userTier) {
  const quotas = {
    'free': '5MB',
    'premium': '50MB',
    'enterprise': '500MB'
  };

  const quota = quotas[userTier] || '5MB';
  storage.setMaxSize(quota);
  console.log(`Applied ${quota} storage quota for ${userTier} users`);
}

applyStorageQuota('premium');
```

---

#### `on()`

Register event listeners for storage events.

**Basic Usage:**
```javascript
storage.on('expired', (key, value) => {
  console.log(`${key} expired:`, value);
});
```

**Parameters:**
- `event` (string): Event name (`'expired'`, `'warning'`, `'full'`)
- `callback` (function): Event handler function

**Returns:** `void`

**Real-life Example - Auto-Refresh Session:**
```javascript
const storage = new Starveil();

storage.on('expired', (key, value) => {
  if (key === 'session') {
    console.log('Session expired, redirecting to login...');
    showNotification('Your session has expired. Please log in again.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }
});

storage.set('session', 'token-abc123', { ttl: '1h' });
```

**Real-life Example - Automatic Cleanup:**
```javascript
storage.on('warning', (message) => {
  console.log(`Warning: ${message}`);
  showNotification(`Storage warning: ${message}`, 'warning');

  const allData = storage.getAll();
  const oldKeys = Object.entries(allData)
    .filter(([_, item]) => item.expiresAt && item.expiresAt < Date.now())
    .map(([key]) => key);

  oldKeys.forEach(key => storage.remove(key));
  console.log(`Cleaned up ${oldKeys.length} expired items`);
});

storage.on('full', () => {
  console.log('Storage is full! Cleaning up...');
  showNotification('Storage full. Cleaning up old data...', 'error');

  const allData = storage.getAll();
  const sortedKeys = Object.entries(allData)
    .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    .slice(0, 5)
    .map(([key]) => key);

  sortedKeys.forEach(key => storage.remove(key));
  console.log(`Removed ${sortedKeys.length} oldest items`);
});
```

**Real-life Example - Analytics Tracking:**
```javascript
storage.on('expired', (key, value) => {
  analytics.track('item_expired', {
    key: key,
    keyType: typeof value,
    timestamp: new Date().toISOString()
  });
});

storage.on('full', () => {
  if (typeof window.Sentry !== 'undefined') {
    Sentry.captureMessage('Storage is full', {
      level: 'warning',
      extra: { itemCount: storage.getInfo().itemCount }
    });
  }
});
```

---

#### `off()`

Remove event listeners to prevent memory leaks.

**Basic Usage:**
```javascript
const handler = (key, value) => {
  console.log(`${key} expired:`, value);
};

storage.on('expired', handler);

storage.off('expired', handler);
```

**Parameters:**
- `event` (string): Event name
- `callback` (function): Event handler function to remove

**Returns:** `void`

**Real-life Example - Component Cleanup:**
```javascript
class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.handleExpiration = this.handleExpiration.bind(this);
  }

  componentDidMount() {
    storage.on('expired', this.handleExpiration);
  }

  componentWillUnmount() {
    storage.off('expired', this.handleExpiration);
  }

  handleExpiration(key, value) {
    if (key === 'user') {
      this.setState({ user: null });
      showNotification('User session expired');
    }
  }
}
```

**Real-life Example - Conditional Monitoring:**
```javascript
let monitorActive = false;

function startMonitoring() {
  if (monitorActive) return;

  storage.on('warning', handleWarning);
  storage.on('full', handleFull);
  monitorActive = true;
  console.log('Storage monitoring started');
}

function stopMonitoring() {
  storage.off('warning', handleWarning);
  storage.off('full', handleFull);
  monitorActive = false;
  console.log('Storage monitoring stopped');
}

function handleWarning(message) {
  console.log(`Warning: ${message}`);
}

function handleFull() {
  console.log('Storage is full!');
}

startMonitoring();
stopMonitoring();
```
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
