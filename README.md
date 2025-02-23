# Bot Guardian JS

A JavaScript/TypeScript library for bot detection and prevention.

## Installation

```bash
npm install bot-guardian-js
```

## Quick Start

```typescript
import { GuardianTracker } from 'bot-guardian-js';

const tracker = new GuardianTracker({
  endpoint: 'https://api.example.com/tracking',
  bufferSize: 5,
  flushInterval: 1000
});
```

## Configuration

The `GuardianTracker` accepts the following configuration options:

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| endpoint | string | Yes | - | The endpoint URL where tracking data will be sent |
| bufferSize | number | No | 10 | Maximum number of events to buffer before sending |
| flushInterval | number | No | 5000 | Interval in milliseconds to flush buffered events |

## API Reference

### GuardianTracker

#### Constructor

```typescript
constructor(config: TrackerConfig)
```

Creates a new instance of GuardianTracker with the specified configuration.

#### Methods

##### getEndpoint()
```typescript
getEndpoint(): string
```
Returns the configured endpoint URL.

## Development

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Testing

The library uses Jest for testing. Run the test suite with:

```bash
npm test
```

## License

[License Type] - see LICENSE file for details

## Features

- Advanced bot detection
- Behavior analysis
- TLS fingerprinting
- User agent analysis
- Express middleware support
- TypeScript support
- Customizable configuration

## Configuration

```typescript
import { GuardianJS, GuardianConfig } from '@guardianjs/core';

const config: GuardianConfig = {
  threshold: 0.8,
  enableBehaviorAnalysis: true,
  enableTLSFingerprinting: true,
  // ... other options
};

const guardian = new GuardianJS(config);
```

## API Reference

### GuardianJS Class

#### Constructor
```typescript
new GuardianJS(config?: GuardianConfig)
```

#### Methods
- `middleware()`: Express middleware function
- `detect(request)`: Standalone detection function
- `analyze(data)`: Analyze behavior data

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| threshold | number | 0.8 | Detection threshold |
| enableBehaviorAnalysis | boolean | true | Enable behavior analysis |
| enableTLSFingerprinting | boolean | true | Enable TLS fingerprinting |
| ... | ... | ... | ... |

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For support, please:
- Open an issue
- Check existing documentation
- Review closed issues before opening new ones

## Security

Please report security vulnerabilities to mhamsho@berkeley.edu

## Acknowledgments

- Thanks to all contributors
- Built with TypeScript
- Tested with Jest

---

Made with ❤️ by the GuardianJS Team








