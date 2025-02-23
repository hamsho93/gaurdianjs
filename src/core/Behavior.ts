import { BehaviorAnalysis } from '../types';

export async function analyzeBehavior(req: any): Promise<BehaviorAnalysis> {
  return {
    score: 0.5,
    patterns: [],
    anomalies: [],
    isBot: false,
    confidence: 0.8
  };
} 