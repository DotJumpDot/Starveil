# Starveil - Agent Guidelines

This document provides guidelines for AI agents working on the Starveil project.

## Project Overview

Starveil is a localStorage management library with built-in expiration, namespace support, and advanced features for web applications. It provides a type-safe, zero-dependency solution for managing browser storage with automatic cleanup, cross-tab synchronization, and event-driven notifications.

## Coding Standards

### TypeScript
- Use strict TypeScript configuration (already enabled in tsconfig.json)
- Define all interfaces and types in `src/core/types.ts`
- Use JSDoc comments for public APIs
- Prefer `const` over `let` when possible
- Use arrow functions for callbacks
- Leverage TypeScript generics for type-safe storage operations

### Code Style
- Follow existing code formatting
- Use descriptive variable and function names
- Keep functions focused and small
- Add comments for complex logic only
- Use TypeScript strict mode features (noImplicitReturns, noUnusedLocals, etc.)

### Error Handling
- Always validate input parameters using validator functions
- Provide clear error messages
- Use try-catch for localStorage operations
- Handle edge cases gracefully
- Emit events for error conditions (storage full, warning, expired)

## PR Process

1. Create a new branch from `main`
2. Make your changes
3. Add tests for new features using Bun test framework
4. Ensure all tests pass (`bun test`)
5. Update CHANGELOG.md if applicable
6. Submit a pull request with:
   - Clear description of changes
   - Related issue number
   - Screenshots if applicable

## Issue Reporting

When reporting issues, include:
- Starveil version
- Browser and version
- Reproduction steps
- Expected vs actual behavior
- Code example demonstrating the issue

## Development Setup

### Prerequisites
- Node.js 18+
- Bun (for testing and package management)

### Installation
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
bun run prepublishOnly # Build and test before publishing
```

## Testing Guidelines

### Test Coverage
- Aim for 100% coverage on core functionality
- Test all public API methods
- Test edge cases and error conditions
- Test cross-tab synchronization
- Mock localStorage for unit tests

### Test Structure
- Group tests by functionality
- Use descriptive test names
- Use `beforeEach` and `afterEach` for setup/teardown
- Test files should be in the `Test/` directory with `.test.ts` extension

### Test Categories
1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test multiple components together
3. **E2E Tests**: Test complete workflows

## Architecture

### Core Modules

#### `src/core/types.ts`
- All TypeScript interfaces and types
- Configuration options (`StarveilOptions`, `StarveilSetOptions`, `StarveilGetOptions`)
- Response formats (`StarveilGetResponse`, `StarveilExpiredResponse`, `StarveilStorageInfo`)
- Event types (`StarveilEventMap`, `StarveilEventType`)
- Storage item structure (`StarveilStorageItem`, `StarveilStoredData`)

#### `src/core/storage.ts`
- `StorageManager` class for localStorage wrapper
- Size tracking and calculation
- Namespace handling with prefix separation
- Cross-tab sync via storage events
- LRU (Least Recently Used) eviction policy
- Methods: `set()`, `get()`, `remove()`, `clear()`, `getAllItems()`, `getUsedSpace()`, `getItemCount()`, `removeExpiredItems()`, `removeOldestItems()`, `setMaxSize()`

#### `src/core/expiration.ts`
- TTL parsing for human-readable formats ('1s', '1m', '1h', '1d', '1w', '2h30m', '1d12h')
- Expiration calculation from TTL strings
- Expiration checking against current time
- Size parsing for human-readable formats ('1KB', '1MB', '1GB')

#### `src/core/validator.ts`
- Key validation (non-empty strings)
- Value validation (not null/undefined)
- TTL validation (proper format)
- Storage access validation (localStorage availability)

#### `src/starveil.ts`
- Main `Starveil<T>` class with generic type support
- Public API methods: `set()`, `get()`, `remove()`, `clear()`, `getAll()`, `getInfo()`, `setMaxSize()`, `on()`, `off()`
- Event system with `Map<event, Set<Function>>` handlers
- Internal state management
- Automatic cleanup interval (every 60 seconds)
- Cross-tab synchronization setup

### Data Flow

```
User Input
    ↓
Starveil.set(key, value, options)
    ↓
Validator.validateKey(), validateValue(), validateTTL()
    ↓
Expiration.calculateExpiration()
    ↓
StarveilStorageItem creation (value, expiresAt, ttl, size, createdAt)
    ↓
checkStorageSpace() → cleanupAndRetry() if needed
    ↓
StorageManager.set()
    ↓
localStorage.setItem()
    ↓
checkWarningThreshold() → emit 'warning' event if 80%+ full
```

### Event System

Starveil provides three event types using TypeScript's `StarveilEventMap`:
- `expired`: Fired when an item expires (key, value)
- `warning`: Fired when storage is almost full (80%+) (message: string)
- `full`: Fired when storage is full and cannot accommodate new items

### Event Handler Guidelines
- Keep event handlers lightweight
- Avoid recursive calls
- Remove unused event handlers using `off()`
- Event errors are caught silently to prevent breaking the application

## Performance Considerations

- Minimize localStorage reads/writes (cached internally)
- Use LRU eviction policy for automatic cleanup
- Automatic cleanup interval runs every 60 seconds
- Implement size limits to prevent storage overflow
- Batch operations when possible
- Use `Blob` size calculation for accurate storage tracking

## Security Considerations

- Validate all input before storage
- Validate data types
- Handle potential XSS vulnerabilities (JSON.stringify/deserialize)
- Don't store sensitive data (passwords, tokens)
- Sanitize keys to prevent namespace collisions

## Browser Compatibility

Target browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Test on all target browsers before release.

## Build System

### TypeScript Configuration
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Declaration files generated (`dist/*.d.ts`)
- Output directory: `./dist`
- Exclude: `node_modules`, `Test`, `dist`, `**/*.test.ts`

### Build Output
- Main: `dist/starveil.js`
- Types: `dist/starveil.d.ts`
- Module: ESNext format
- ES2020 target for modern browsers

## Package Information

### Scripts
- `build`: Compile TypeScript
- `test`: Run Bun tests
- `test:watch`: Run tests in watch mode
- `test:coverage`: Run tests with coverage
- `prepublishOnly`: Build and test before publishing

### Files Included in NPM Package
- `dist/` - Compiled JavaScript and TypeScript declarations
- `LICENSE` - MIT License
- `README.md` - Documentation
- `CHANGELOG.md` - Version history

### Dependencies
- **Runtime**: Zero runtime dependencies - pure TypeScript
- **Dev Dependencies**: `@types/jest`, `jest`, `ts-jest`, `typescript`

### Keywords
localstorage, storage, ttl, expiration, cache, web, browser, namespace, cross-tab, typescript

## Release Process

### Versioning
Follow semantic versioning:
- **1.0.0**: Complete stable release
- **0.x.0**: Major features/new functions
- **0.0.x**: Minor updates, docs, bug fixes

### Release Checklist
- [ ] All tests pass (`bun test`)
- [ ] Documentation updated (README.md, AGENTS.md)
- [ ] CHANGELOG.md updated
- [ ] Build successful (`bun run build`)
- [ ] No breaking changes (unless major version)
- [ ] Tagged with version number
- [ ] Published to npm

### Publishing
```bash
bun run build
bun run test
npm publish
```

## Contributing

We welcome contributions! Please:
- Follow the coding standards
- Add tests for new features
- Update documentation
- Submit pull requests for review
- Follow semantic versioning for breaking changes

## Contact

For questions or suggestions:
- Open an issue on GitHub: https://github.com/dotjumpdot/starveil/issues
- Contact maintainer: DotJumpDot
