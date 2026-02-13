# Changelog

All notable changes to Starveil will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0] - 2026-02-13

### Added

- **Initial Release**: Complete localStorage with expiration library
  - **TTL Support**: Time-to-live with human-readable format ('1s', '1m', '1h', '1d', '1w', '2h30m', '1d12h')
  - **Namespace**: Optional prefix to avoid key collisions between different applications
  - **Size Management**: Auto-cleanup oldest items when storage is full using LRU (Least Recently Used) eviction policy
  - **Custom Response**: { starveilInfo: 'expired', starveilStatus: false } for expired data instead of null
  - **Event System**: expired, warning, full events for reactive programming and monitoring
  - **TypeScript Support**: Full type definitions included with IntelliSense support
  - **Cross-Tab Sync**: Synchronize storage across browser tabs using storage events
  - **Metadata Access**: Get expiration time, TTL, and storage info for detailed monitoring
  - **Validation**: Validate data before storage including type checking and size validation
  - **Zero Runtime Dependencies**: Pure JavaScript/TypeScript implementation with no external dependencies

### API Methods

- `set(key, value, options?)` - Store data with optional TTL
- `get(key, options?)` - Retrieve data from storage with optional metadata
- `remove(key)` - Remove a specific key
- `clear()` - Remove all items from storage
- `getAll()` - Get all items from storage with metadata
- `getInfo()` - Get storage information (usedSpace, freeSpace, itemCount, maxSize)
- `on(event, callback)` - Register event listeners
- `off(event, callback)` - Remove event listeners

### Documentation

- **README.md**: Professional documentation with installation, API reference, and examples
- **AGENTS.md**: Project guidelines for contributors including coding standards and PR process
- **LICENSE**: MIT License 2026 DotJumpDot
- **CHANGELOG.md**: Version history following Keep a Changelog format

### Development

- **TypeScript**: TypeScript configuration with strict mode enabled
- **Testing**: Jest test framework with comprehensive test coverage
- **Build System**: TypeScript compiler with declaration file generation
- **Project Structure**: Organized source code with core modules separation

### Features

1. **TTL Support**: Time-to-live with human-readable format ('1h', '30m', '2d')
2. **Namespace**: Optional prefix to avoid collisions
3. **Size Management**: Auto-cleanup oldest items when storage full
4. **Custom Response**: { starveilInfo: 'expired', starveilStatus: false } for expired data
5. **Events**: expired, warning, full
6. **TypeScript Support**: Full type definitions included
7. **Cross-Tab Sync**: Synchronize storage across browser tabs
8. **Metadata Access**: Get expiration time, TTL, and storage info
9. **Validation**: Validate data before storage

### Dependencies

- **Runtime**: Zero runtime dependencies - pure JavaScript/TypeScript
- **Dev Dependencies**: TypeScript, Jest, @types/jest, ts-jest

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Versioning Scheme

- **1.0.0** - Complete stable release
- **0.x.0** - Major features/new functions
- **0.0.x** - Minor updates, docs, bug fixes
