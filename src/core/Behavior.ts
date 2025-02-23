import { BehaviorAnalysis } from '../types';

export async function analyzeBehavior(req: any): Promise<BehaviorAnalysis> {
  try {
    const patterns = req.behaviorData ? {
      mouseMovements: req.behaviorData.mouseMovements || 0,
      scrollPatterns: req.behaviorData.scrollPatterns || 0,
      interactionSpeed: req.behaviorData.interactionSpeed || 0
    } : {
      mouseMovements: 0,
      scrollPatterns: 0,
      interactionSpeed: 0
    };

    return {
      score: 0.5,
      patterns: [patterns],
      anomalies: [],
      isBot: false,
      confidence: 0.8
    };
  } catch (error) {
    return {
      score: 0,
      patterns: [{
        mouseMovements: 0,
        scrollPatterns: 0,
        interactionSpeed: 0
      }],
      anomalies: [],
      isBot: false,
      confidence: 0.8
    };
  }
} 