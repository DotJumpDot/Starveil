# Changelog

All notable changes to Starveil will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.1] - 2026-02-13

### Documentation

- **Enhanced README**: Completely restructured API Reference section
  - Added quick-reference table for all methods
  - Added basic usage examples for each method
  - Added 2+ real-life examples per method showing practical applications
  - Improved readability with clearer formatting and structure
  - Simplified Table of Contents for easier navigation

### Changed

- **Table of Contents**: Removed self-referencing link and nested sections for cleaner structure
- **Method Documentation**: Each method now includes practical use cases (session management, shopping carts, user logout, storage monitoring, etc.)

### API Examples

New documentation examples include:
- Session token management with countdown timers
- Shopping cart expiration and recovery
- User logout flows with cleanup
- Storage health monitoring and warnings
- Data export functionality
- Event-driven automatic cleanup
- React component lifecycle management
- Conditional monitoring with start/stop controls

## [1.1.0] - 2026-02-13

### Added

- **Enhanced Constructor API**: More flexible initialization options
  - String argument support: `new Starveil('myapp')` for namespace without expiration
  - New `name` option as alias for `namespace`
  - New `expire` option as alias for `defaultTTL`
  - Default namespace is now 'Starveil' when no arguments provided
  - Default TTL is `null` (no expiration) when not specified

### Changed

- **Bug Fix**: Fixed TypeScript error where `item.expiresAt` could be null in `removeExpiredItems()` method
- **Documentation**: Updated AGENTS.md to use `bun publish` instead of `npm publish`
- **Tests**: Added comprehensive test coverage for new constructor variations

### API Examples

```javascript
// Default: namespace='Starveil', no expiration
const storage = new Starveil();

// String argument: namespace='myapp', no expiration
const storage = new Starveil('myapp');

// New API with name and expire
const storage = new Starveil({
  name: 'myapp',
  expire: '1h'
});

// Backward compatible with namespace and defaultTTL
const storage = new Starveil({
  namespace: 'myapp',
  defaultTTL: '1h'
});
```

### Documentation

- Updated README.md Quick Start section with new constructor examples
- Updated AGENTS.md to reflect Bun as the primary package manager

## [1.0.0] - 2026-02-13

### Added

- **Initial Stable Release**: Complete localStorage management library with expiration
  - **TTL Support**: Time-to-live with human-readable format ('1s', '1m', '1h', '1d', '1w', '2h30m', '1d12h')
  - **Namespace**: Optional prefix to avoid key collisions between different applications
  - **Size Management**: Auto-cleanup oldest items when storage is full using LRU (Least Recently Used) eviction policy
  - **Custom Response**: { starveilInfo: 'expired', starveilStatus: false } for expired data instead of null
  - **Event System**: expired, warning, full events for reactive programming and monitoring
  - **TypeScript Support**: Full type definitions included with generic type support
  - **Cross-Tab Sync**: Synchronize storage across browser tabs using storage events
  - **Metadata Access**: Get expiration time, TTL, and storage info for detailed monitoring
  - **Validation**: Validate data before storage including type checking and size validation
  - **Zero Runtime Dependencies**: Pure TypeScript implementation with no external dependencies

### API Methods

- `set(key, value, options?)` - Store data with optional TTL
- `get(key, options?)` - Retrieve data from storage with optional metadata
- `remove(key)` - Remove a specific key
- `clear()` - Remove all items from storage
- `getAll()` - Get all items from storage with metadata
- `getInfo()` - Get storage information (usedSpace, freeSpace, itemCount, maxSize)
- `setMaxSize(size)` - Dynamically set maximum storage size
- `on(event, callback)` - Register event listeners
- `off(event, callback)` - Remove event listeners

### Core Architecture

- **StorageManager**: LocalStorage wrapper with namespace support, size tracking, and cross-tab synchronization
- **Expiration Engine**: TTL parsing, expiration calculation, and checking
- **Validator Module**: Key, value, TTL, and storage access validation
- **Event System**: Type-safe event handling with Map-based handler management
- **Automatic Cleanup**: Interval-based cleanup (every 60 seconds) and on-demand cleanup

### Documentation

- **README.md**: Professional documentation with installation, API reference, and examples
- **AGENTS.md**: Comprehensive project guidelines for contributors including coding standards, architecture, and PR process
- **LICENSE**: MIT License 2026 DotJumpDot
- **CHANGELOG.md**: Version history following Keep a Changelog format

### Development

- **TypeScript**: TypeScript 5.3+ with strict mode configuration (ES2020 target, ESNext module)
- **Testing**: Bun test framework with comprehensive test coverage
- **Build System**: TypeScript compiler with declaration file generation
- **Project Structure**: Organized source code with core modules separation

### Features

1. **TTL Support**: Time-to-live with human-readable format ('1s', '1m', '1h', '1d', '1w', '2h30m', '1d12h')
2. **Namespace**: Optional prefix to avoid key collisions across applications
3. **Size Management**: Auto-cleanup oldest items when storage full using LRU eviction
4. **Custom Response**: { starveilInfo: 'expired', starveilStatus: false } for expired data
5. **Events**: expired, warning (80% full), full events
6. **TypeScript Support**: Full type definitions with generic type support (Starveil)
7. **Cross-Tab Sync**: Synchronize storage across browser tabs using storage events
8. **Metadata Access**: Get expiration time, TTL, and storage info
9. **Validation**: Validate data before storage (key, value, TTL, storage access)
10. **Dynamic Max Size**: Set maximum storage size dynamically with `setMaxSize()`

### Dependencies

- **Runtime**: Zero runtime dependencies - pure TypeScript
- **Dev Dependencies**: TypeScript 5.3.0+, Jest 29.7.0, @types/jest 29.5.0, ts-jest 29.1.0

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Versioning Scheme

- **1.0.0** - Complete stable release (current)
- **0.x.0** - Major features/new functions
- **0.0.x** - Minor updates, docs, bug fixes

### Performance

- Automatic cleanup interval (60 seconds)
- LRU eviction policy for efficient space management
- Blob-based size calculation for accurate storage tracking
- Cached storage information to minimize localStorage reads

### Security

- Input validation for all storage operations
- Type checking for stored values
- XSS-safe JSON serialization/deserialization
- Namespace sanitization to prevent collisions

## Versioning

- **1.0.0** - Complete stable release
- **0.x.0** - Major features/new functions
- **0.0.x** - Minor updates, docs, bug fixes
