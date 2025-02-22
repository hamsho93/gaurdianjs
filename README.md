# GuardianJS

Advanced bot detection and security middleware for Node.js applications.

## Installation

```bash
npm install @guardianjs/core
```

## Quick Start

```typescript
import { GuardianJS } from '@guardianjs/core';

// Initialize GuardianJS
const guardian = new GuardianJS();

// Use with Express
app.use(guardian.middleware());

// Or use standalone
const result = await guardian.detect(request);
```

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

Please report security vulnerabilities to security@guardianjs.com

## Acknowledgments

- Thanks to all contributors
- Built with TypeScript
- Tested with Jest

---

Made with ❤️ by the GuardianJS Team








