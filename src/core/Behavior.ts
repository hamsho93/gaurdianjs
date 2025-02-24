import { BehaviorAnalysis } from '../types';

export function analyzeBehavior(data: Partial<BehaviorAnalysis> = {}): BehaviorAnalysis {
  // Match demo server behavior structure (lines 93-98)
  return {
    mouseMovements: data.mouseMovements || 0,
    keystrokes: data.keystrokes || 0,
    timeOnPage: data.timeOnPage || 0,
    scrolling: data.scrolling || false
  };
} 