# GuardianJS

Bot detection and prevention library for Node.js and web applications with real-time monitoring dashboard.

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

### As Express Middleware

```javascript
const express = require('express');
const app = express();

// Add GuardianJS middleware
app.use(async (req, res, next) => {
  try {
    const result = await guardian.isBot({
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      req
    });
    
    req.botDetection = result;
    next();
  } catch (error) {
    console.error('GuardianJS error:', error);
    next();
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
    botDetection: req.botDetection
  });
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

## Cross-Platform Integration

GuardianJS can be used with multiple web frameworks through its API service and language-specific clients.

### Node.js/Express Integration

```javascript
const express = require('express');
const { GuardianJS } = require('bot-guardian-js');

const app = express();
const guardian = new GuardianJS({
  useBehavior: true,
  threshold: 0.5
});

// Add middleware
app.use(async (req, res, next) => {
  try {
    const result = await guardian.isBot({
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      req
    });
    
    req.botDetection = result;
    next();
  } catch (error) {
    console.error('GuardianJS error:', error);
    next();
  }
});
```

### Python/Flask Integration

For Python applications, you can use GuardianJS as a REST API service:

1. First, start the GuardianJS API server:

```javascript
// guardian-api.js
const { createApiServer } = require('bot-guardian-js');

const app = createApiServer();
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`GuardianJS API running on port ${PORT}`);
});
```

2. Then integrate with Flask:

```python
from flask import Flask, request, g, jsonify
import requests

app = Flask(__name__)

def detect_bot(user_agent, ip, path=None):
    """Call the GuardianJS API to detect bots"""
    response = requests.post(
        "http://localhost:3333/detect",
        json={
            "userAgent": user_agent,
            "ip": ip,
            "path": path
        }
    )
    return response.json()

@app.before_request
def before_request():
    """Add bot detection to each request"""
    g.bot_detection = detect_bot(
        user_agent=request.headers.get('User-Agent', ''),
        ip=request.remote_addr,
        path=request.path
    )

@app.route('/')
def home():
    return jsonify({
        'message': 'Hello World',
        'bot_detection': g.bot_detection
    })
```

### PHP Integration

For PHP applications like WordPress or Laravel:

```php
<?php
// Detect bot using GuardianJS API
function detectBot($userAgent, $ip, $path = '') {
    $data = json_encode([
        'userAgent' => $userAgent,
        'ip' => $ip,
        'path' => $path
    ]);
    
    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\n",
            'method'  => 'POST',
            'content' => $data
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents('http://localhost:3333/detect', false, $context);
    
    return json_decode($result, true);
}

// Example usage in WordPress
add_action('template_redirect', function() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $path = $_SERVER['REQUEST_URI'] ?? '';
    
    $botDetection = detectBot($userAgent, $ip, $path);
    
    if ($botDetection['isBot']) {
        // Handle bot traffic (e.g., show different content, block, etc.)
    }
});
```

## Demo Application

A complete demo implementation is available in the `guardianjs-demo` folder. The demo shows:

- Express middleware integration
- Custom bot detection rules
- Integration tests
- Basic analytics dashboard

### Demo Structure

```
guardianjs-demo/
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

## Testing Bot Detection

You can test the bot detection by sending requests with different user agents:

View dashboard at http://localhost:3001/dashboard

```bash
# Test with a regular browser
curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" http://localhost:3001/

# Test with a known bot
curl -A "Googlebot/2.1 (+http://www.google.com/bot.html)" http://localhost:3001/

# Test with an LLM bot
curl -A "GPTBot/1.0" http://localhost:3001/
```

The response will include the detection results, showing whether the request was identified as a bot and the confidence score.

## Response Structure

The `isBot()` method returns:

```javascript
{
  isBot: boolean,
  confidence: number,
  score: number,
  reasons: string[],
  behavior: {
    mouseMovements: number,
    keystrokes: number,
    timeOnPage: number,
    scrolling: boolean
  }
}
```

## Testing

Run the test suite:

```bash
npm test
```

The test suite includes:
- Integration tests for bot detection
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

### Dashboard Setup

The dashboard is automatically configured when using the middleware: