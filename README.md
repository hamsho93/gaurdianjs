# Bot Guardian JS

A JavaScript/TypeScript library for bot detection and prevention with optional server functionality.

## Installation

```bash
npm install bot-guardian-js
```

## Quick Start

### Basic Tracker Usage
```typescript
const GuardianTracker = require('bot-guardian-js');

const tracker = new GuardianTracker({
  endpoint: 'https://api.example.com/tracking',
  bufferSize: 5,
  flushInterval: 1000
});
```

### Server Integration
```typescript
const GuardianTracker = require('bot-guardian-js');
const { middleware } = require('bot-guardian-js/dist/middleware/express');

// Create tracker
const tracker = new GuardianTracker({
  endpoint: 'https://api.example.com/tracking'
});

// Create and start server
const startGuardianServer = async () => {
  const app = middleware.create();
  const server = await middleware.start(3000);
  console.log('Guardian server running on port 3000');
  return server;
};
```

## Configuration

### Tracker Configuration
| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| endpoint | string | Yes | - | The endpoint URL where tracking data will be sent |
| bufferSize | number | No | 10 | Maximum number of events to buffer before sending |
| flushInterval | number | No | 5000 | Interval in milliseconds to flush buffered events |

### Server Configuration
| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| port | number | No | 3000 | Port number for the server to listen on |
| middleware | object | No | {} | Express middleware configuration options |

## API Reference

### GuardianTracker Class

#### Constructor
```typescript
constructor(config: TrackerConfig)
```
Creates a new instance of GuardianTracker with the specified configuration.

#### Methods
```typescript
getEndpoint(): string
```
Returns the configured endpoint URL.

### Server Middleware

#### Create Middleware
```typescript
middleware.create(options?: MiddlewareOptions): Application
```
Creates an Express application with Guardian middleware configured.

Options:
- `cors`: Enable/disable CORS (default: false)
- `bodyParser`: Enable/disable body parsing (default: true)
- `compression`: Enable/disable response compression (default: true)

#### Start Server
```typescript
middleware.start(port?: number): Promise<Server>
```
Starts the Guardian server on the specified port.

## Examples

### Basic Tracking
```typescript
const GuardianTracker = require('bot-guardian-js');

const tracker = new GuardianTracker({
  endpoint: 'https://api.example.com/tracking'
});

console.log(tracker.getEndpoint());  // https://api.example.com/tracking
```

### Server with Custom Configuration
```typescript
const GuardianTracker = require('bot-guardian-js');
const { middleware } = require('bot-guardian-js/dist/middleware/express');

const setupServer = async () => {
  // Create Express app with custom middleware options
  const app = middleware.create({
    cors: true,
    bodyParser: true,
    compression: true
  });

  // Start server on custom port
  const server = await middleware.start(8080);
  console.log('Server running on port 8080');

  return server;
};

// Handle server shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server shut down');
  });
});
```

### Complete Setup
```typescript
const GuardianTracker = require('bot-guardian-js');
const { middleware } = require('bot-guardian-js/dist/middleware/express');

async function setup() {
  // Initialize tracker
  const tracker = new GuardianTracker({
    endpoint: 'https://api.example.com/tracking',
    bufferSize: 5,
    flushInterval: 1000
  });

  // Create and configure server
  const app = middleware.create({
    cors: true
  });

  // Start server
  const server = await middleware.start(3000);
  console.log('Guardian server running on port 3000');

  return { tracker, server };
}

// Usage
setup()
  .then(({ tracker, server }) => {
    console.log('Setup complete');
  })
  .catch(console.error);
```

## Error Handling

The server middleware includes built-in error handling:

```typescript
// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## Best Practices

1. **Server Management**
   - Always handle server shutdown gracefully
   - Use appropriate error handling
   - Configure middleware based on your needs

2. **Security**
   - Enable CORS only when necessary
   - Use appropriate rate limiting
   - Implement proper authentication

3. **Performance**
   - Adjust buffer size based on your traffic
   - Set appropriate flush intervals
   - Enable compression for large payloads

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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








