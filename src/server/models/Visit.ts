import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  isBot: { type: Boolean, required: true },
  score: { type: Number, required: true },
  reasons: [String],
  confidence: { type: Number, required: true },
  behavior: {
    mouseMovements: { type: Number, default: 0 },
    keystrokes: { type: Number, default: 0 },
    timeOnPage: { type: Number, default: 0 },
    scrolling: { type: Boolean, default: false }
  },
  sessionId: { type: String, required: true },
  clientId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Visit = mongoose.model('Visit', visitSchema); 