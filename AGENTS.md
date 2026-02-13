# Starveil - Agent Guidelines

This document provides guidelines for AI agents working on the Starveil project.

## Project Overview

Starveil is a localStorage management library with built-in expiration, namespace support, and advanced features for web applications.

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define all interfaces and types in `src/core/types.ts`
- Use JSDoc comments for public APIs
- Prefer `const` over `let` when possible
- Use arrow functions for callbacks

### Code Style
- Follow existing code formatting
- Use descriptive variable and function names
- Keep functions focused and small
- Add comments for complex logic only

### Error Handling
- Always validate input parameters
- Provide clear error messages
- Use try-catch for localStorage operations
- Handle edge cases gracefully

## PR Process

1. Create a new branch from `main`
2. Make your changes
3. Add tests for new features
4. Ensure all tests pass
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
- Node.js 18+ or 20+
- npm, yarn, pnpm, or bun

### Installation
```bash
git clone <repository-url>
cd starveil
npm install
```

### Development Commands
```bash
npm run build          # Build TypeScript
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

## Testing Guidelines

### Test Coverage
- Aim for 100% coverage on core functionality
- Test all public API methods
- Test edge cases and error conditions
- Test cross-tab synchronization

### Test Structure
- Group tests by functionality
- Use descriptive test names
- Use `beforeEach` and `afterEach` for setup/teardown
- Mock localStorage for unit tests

### Test Categories
1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test multiple components together
3. **E2E Tests**: Test complete workflows

## Architecture

### Core Modules

#### `src/core/types.ts`
- All TypeScript interfaces and types
- Configuration options
- Response formats

#### `src/core/storage.ts`
- localStorage wrapper
- Size tracking
- Namespace handling
- Cross-tab sync

#### `src/core/expiration.ts`
- TTL parsing
- Expiration calculation
- Expiration checking

#### `src/core/validator.ts`
- Data validation
- Type checking
- Size validation

#### `src/starveil.ts`
- Main Starveil class
- Public API methods
- Event system
- Internal state management

### Data Flow

```
User Input
    ↓
Starveil.set()
    ↓
Validator.validate()
    ↓
Storage.write()
    ↓
Expiration.calculate()
    ↓
localStorage.setItem()
```

## Event System

Starveil provides three event types:
- `expired`: Fired when an item expires
- `warning`: Fired when storage is almost full (80%+)
- `full`: Fired when storage is full

### Event Handler Guidelines
- Keep event handlers lightweight
- Avoid recursive calls
- Remove unused event handlers

## Performance Considerations

- Minimize localStorage reads/writes
- Cache frequently accessed data
- Use batch operations when possible
- Implement size limits to prevent storage overflow

## Security Considerations

- Sanitize all input before storage
- Validate data types
- Handle potential XSS vulnerabilities
- Don't store sensitive data (passwords, tokens)

## Browser Compatibility

Target browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Test on all target browsers before release.

## Release Process

### Versioning
Follow semantic versioning:
- **1.0.0**: Complete stable release
- **0.x.0**: Major features/new functions
- **0.0.x**: Minor updates, docs, bug fixes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Build successful
- [ ] No breaking changes (unless major version)
- [ ] Tagged with version number

### Publishing
```bash
npm run build
npm publish
```

## Contributing

We welcome contributions! Please:
- Follow the coding standards
- Add tests for new features
- Update documentation
- Submit pull requests for review

## Contact

For questions or suggestions:
- Open an issue on GitHub
- Contact maintainer: DotJumpDot
