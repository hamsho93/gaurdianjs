# GuardianJS

A powerful bot detection and prevention library for Node.js and web applications with real-time monitoring dashboard.

## Features

- 🤖 Advanced Bot Detection
- 🔍 Behavioral Analysis
- 🔐 TLS Fingerprinting
- 📱 User Agent Analysis
- 🤖 LLM & AI Bot Detection
- ⚡ Real-time Tracking
- 🛡️ Express/Connect Middleware
- 📊 Detailed Analytics

## Installation

```bash
npm install bot-guardian-js
```

## Quick Start

```javascript
const { GuardianJS } = require('bot-guardian-js');

const guardian = new GuardianJS({
    endpoint: 'http://your-api.com/track',
    trackingEnabled: true,
    detectionThreshold: 0.8,
    useTLS: true,
    useBehavior: true,
    threshold: 0.5,
    customRules: [
        {
            name: 'Known Bot Detection',
            test: (params) => {
                const knownBots = [
                    'googlebot',
                    'bingbot',
                    'yandexbot',
                    'duckduckbot',
                    'baiduspider',
                    'facebookexternalhit'
                ];
                const ua = params.userAgent.toLowerCase();
                return knownBots.some(bot => ua.includes(bot));
            },
            score: 1.0
        },
        {
            name: 'LLM Bot Detection',
            test: (params) => {
                const llmBots = [
                    'gptbot',
                    'chatgpt-user',
                    'oai-searchbot',
                    'claude-web',
                    'anthropic-ai'
                ];
                const ua = params.userAgent.toLowerCase();
                return llmBots.some(bot => ua.includes(bot));
            },
            score: 1.0
        }
    ]
});
```

## Usage

### As Middleware

```javascript
const express = require('express');
const app = express();

// Add GuardianJS middleware
app.use(guardian.middleware());

// Bot detection results will be available in req
app.get('/', async (req, res) => {
    const result = await guardian.detect(req);
    res.json({ result });
});
```

### Direct Bot Detection

```javascript
const result = await guardian.detect(req);
console.log(result);
// {
//   behavior: { ... },
//   tls: { ... },
//   userAgent: { ... },
//   verdict: false
// }
```

## Event Tracking

```javascript
await guardian.track({
    type: 'click',
    x: 100,
    y: 200,
    timestamp: Date.now()
});

// Flush events manually
await guardian.flush();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| endpoint | string | null | API endpoint for event tracking |
| trackingEnabled | boolean | true | Enable/disable event tracking |
| detectionThreshold | number | 0.8 | Bot detection threshold |
| trackingInterval | number | 1000 | Interval for event flushing |
| bufferSize | number | 10 | Maximum events before flush |
| useTLS | boolean | true | Enable TLS fingerprinting |
| useBehavior | boolean | true | Enable behavioral analysis |
| threshold | number | 0.5 | Overall detection threshold |
| enableBehaviorAnalysis | boolean | true | Enable behavior tracking |
| customRules | array | [] | Custom detection rules |

## LLM Bot Detection

GuardianJS automatically detects AI-powered bots from major providers including:

- OpenAI's GPTBot
- ChatGPT User Agent
- OpenAI's SearchBot
- Claude/Anthropic crawlers
- Other LLM-based crawlers

This helps protect your content from unauthorized scraping by AI systems.

## Demo Application

A complete demo implementation is available in the `guardianjs-demo` folder. The demo shows:

- Express middleware integration
- Custom bot detection rules
- Integration tests
- Basic analytics dashboard

### Demo Structure

```typescript:guardianjs-demo/
src/
  ├── server/
  │   ├── __tests__/
  │   │   └── server.test.ts   # Integration tests
  │   └── index.ts             # Express server setup
  └── dashboard/
      └── index.html           # Analytics dashboard
```

### Running the Demo

```bash
cd guardianjs-demo
npm install
npm run dev    # Start development server
npm test       # Run integration tests
```

### Key Features

- Real-time bot detection using custom rules
- Express middleware integration (see `src/server/index.ts` lines 14-115)
- Integration tests for both regular users and known bots (see `src/server/__tests__/server.test.ts` lines 4-24)
- Simple REST API endpoints:
  - GET / - Welcome message with bot detection results
  - GET /data - Analytics data endpoint

For more details, check out the demo implementation in the `guardianjs-demo` folder.

## Response Structure

The `detect()` method returns:

```javascript
{
    behavior: {
        anomalies: [],
        confidence: number,
        isBot: boolean,
        patterns: [{
            interactionSpeed: number,
            mouseMovements: number,
            scrollPatterns: number
        }],
        score: number
    },
    tls: {
        fingerprint: string,
        isSuspicious: boolean,
        score: number,
        version: string
    },
    userAgent: {
        browser: string,
        device: string,
        isBot: boolean,
        os: string
    },
    verdict: boolean
}
```

## Testing

Run the test suite:

```bash
npm test
```

The test suite includes:
- Integration tests for bot detection
- Event tracking verification
- Middleware functionality
- Configuration validation
- LLM bot detection verification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

Built with TypeScript and ❤️

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.