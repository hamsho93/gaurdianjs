import { analyzeBehavior } from '../Behavior';
import type { BehaviorAnalysis } from '../../types';

describe('Behavior Analysis', () => {
  test('should analyze basic behavior patterns', async () => {
    const mockBehavior: Partial<BehaviorAnalysis> = {
      mouseMovements: 0,
      keystrokes: 0,
      timeOnPage: 0,
      scrolling: false
    };

    const result = await analyzeBehavior(mockBehavior);

    expect(result).toBeDefined();
    expect(result.mouseMovements).toBe(0);
    expect(result.keystrokes).toBe(0);
    expect(result.timeOnPage).toBe(0);
    expect(result.scrolling).toBe(false);
  });

  test('should handle empty behavior data', async () => {
    const mockBehavior: Partial<BehaviorAnalysis> = {};

    const result = await analyzeBehavior(mockBehavior);

    expect(result).toBeDefined();
    expect(result.mouseMovements).toBe(0);
    expect(result.keystrokes).toBe(0);
    expect(result.timeOnPage).toBe(0);
    expect(result.scrolling).toBe(false);
  });
}); 