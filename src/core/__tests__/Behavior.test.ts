import { analyzeBehavior } from '../Behavior';

describe('Behavior Analysis', () => {
  const mockReq = {
    headers: {
      'user-agent': 'Mozilla/5.0'
    },
    ip: '127.0.0.1'
  };

  test('should analyze normal behavior', async () => {
    const result = await analyzeBehavior(mockReq);
    expect(result.isBot).toBe(false);
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should analyze normal user behavior patterns', async () => {
    const mockReq = {
      body: {
        mouseMovements: [
          { x: 100, y: 200, timestamp: Date.now() },
          { x: 150, y: 250, timestamp: Date.now() + 100 }
        ],
        scrollEvents: [
          { position: 500, timestamp: Date.now() },
          { position: 700, timestamp: Date.now() + 200 }
        ]
      }
    };

    const result = await analyzeBehavior(mockReq);
    expect(result.isBot).toBe(false);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.patterns).toBeDefined();
  });

  test('should handle empty behavior data', async () => {
    const mockReq = {
      body: {}
    };

    const result = await analyzeBehavior(mockReq);
    expect(result.isBot).toBe(false);
    expect(result.confidence).toBe(0.8);
    expect(result.patterns).toEqual({
      mouseMovements: 0,
      scrollPatterns: 0,
      interactionSpeed: 0
    });
  });

  test('should handle missing request body', async () => {
    const mockReq = {};

    const result = await analyzeBehavior(mockReq);
    expect(result.isBot).toBe(false);
    expect(result.patterns).toBeDefined();
  });
}); 