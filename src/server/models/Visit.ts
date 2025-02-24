import mongoose from 'mongoose';
import { DetectionResult } from '../../types';

const visitSchema = new mongoose.Schema<DetectionResult>({
  timestamp: { type: Date, required: true },
  isBot: { type: Boolean, required: true },
  confidence: { type: Number, required: true },
  path: { type: String, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  reasons: [String],
  behavior: {
    mouseMovements: Number,
    keystrokes: Number,
    timeOnPage: Number,
    scrolling: Boolean,
    score: Number,
    patterns: [{
      mouseMovements: Number,
      scrollPatterns: Number,
      interactionSpeed: Number
    }],
    anomalies: [mongoose.Schema.Types.Mixed],
    isBot: Boolean,
    confidence: Number
  }
});

export const Visit = mongoose.model<DetectionResult>('Visit', visitSchema); 