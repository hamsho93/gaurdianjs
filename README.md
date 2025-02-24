# GuardianJS

A powerful bot detection and prevention library for Node.js and web applications with real-time monitoring dashboard.

## Features

- 🤖 Advanced bot detection with customizable rules
- 📊 Real-time monitoring dashboard
- 🔍 Behavioral analysis (mouse movements, keystrokes, scrolling)
- 🚀 Express.js middleware
- 📈 Request tracking and analytics
- 🛡️ Known bot patterns detection

## Installation

```bash
npm install guardianjs
```

## Quick Start

### Express Middleware Setup

```typescript
import { GuardianJS } from 'guardianjs';

const guardian = new GuardianJS({
  useBehavior: true,
  threshold: 0.5,
  customRules: [
    {
      name: 'Known Bot Detection',
      test: (params: BotDetectionParams) => {
        const knownBots = [
          'googlebot',
          'bingbot',
          'yandexbot',
          'duckduckbot',
          'baiduspider',
          'facebookexternalhit'
        ];
        const ua = params.userAgent.toLowerCase();
        const isBot = knownBots.some(bot => ua.includes(bot));
        console.log('Bot detection result:', { userAgent: ua, isBot });
        return isBot;
      },
      score: 1.0
    }
  ]
});

// Add middleware
app.use(async (req, res, next) => {
  const result = await guardian.isBot({
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip
  });
  req.botDetection = result;
  next();
});
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| endpoint | string | required | Tracking endpoint URL |
| trackingEnabled | boolean | true | Enable/disable tracking |
| threshold | number | 0.5 | Bot detection threshold |
| useTLS | boolean | true | Enable TLS fingerprinting |
| useBehavior | boolean | true | Enable behavior analysis |
| customRules | CustomRule[] | [] | Array of custom detection rules |

## Dashboard Features

- Real-time request monitoring
- Bot detection statistics
- Behavioral metrics tracking
- User agent analysis
- Detection confidence scores

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

### Bot Detection Result
```typescript
interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  behavior?: {
    mouseMovements: number;
    keystrokes: number;
    timeOnPage: number;
    scrolling: boolean;
  };
  reasons: string[];
}
```

## Testing

```bash
npm test
```

## Demo

Check out the demo application in the `guardianjs-demo` directory for a complete implementation example.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

## License

MIT

---

Built with TypeScript and ❤️

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