# Bot Guardian JS

A powerful bot detection and prevention library for Node.js applications.

## Features

- 🤖 Advanced bot detection
- 🔒 TLS fingerprinting
- 📊 Behavior analysis
- 🚀 Express.js middleware
- ⚡ High performance
- 🔧 Highly configurable

## Installation

```bash
npm install bot-guardian-js
```

## Quick Start

```typescript
import { GuardianJS } from 'bot-guardian-js';

// Initialize
const guardian = new GuardianJS({
  endpoint: 'http://your-api.com/track',
  trackingEnabled: true,
  threshold: 0.8
});

// Use as middleware
app.use(guardian.middleware());

// Manual bot detection
const isBot = await guardian.isBot({
  userAgent: req.headers['user-agent'],
  ip: req.ip,
  req: req
});

// Track events
guardian.track({
  event: 'pageview',
  path: '/home'
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| endpoint | string | required | Tracking endpoint URL |
| trackingEnabled | boolean | true | Enable/disable tracking |
| threshold | number | 0.7 | Bot detection threshold |
| useTLS | boolean | true | Enable TLS fingerprinting |
| useBehavior | boolean | true | Enable behavior analysis |

## API Reference

### GuardianJS Class

#### Constructor
```typescript
new GuardianJS(config: GuardianConfig)
```

#### Methods
- `isBot(params)`: Detect if request is from a bot
- `track(event)`: Track user/bot events
- `middleware()`: Express.js middleware

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

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








