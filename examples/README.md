# GuardianJS Examples

This directory contains example implementations of GuardianJS.

## Basic Example
Simple Express server with basic bot detection:
```bash
npm run start:basic
```

## Advanced Example
Express server with custom configuration and advanced features:
```bash
npm run start:advanced
```

## TypeScript Example
Full TypeScript implementation with React integration:
```bash
npm run start:typescript
```

## Testing the Examples

1. Start any example server
2. Send requests to test endpoints:
   ```bash
   # Test basic protection
   curl http://localhost:3000/

   # Test bot detection
   curl -X POST http://localhost:3000/check

   # Test with custom headers
   curl -H "X-Custom-Header: true" http://localhost:3001/api/data
   ```

## Configuration

See the advanced example for full configuration options. 