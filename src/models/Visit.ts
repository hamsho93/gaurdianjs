import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  clientId: String,
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
  userAgent: String,
  ip: String,
  isBot: Boolean,
  behavior: {
    mouseMovements: Number,
    keystrokes: Number,
    timeOnPage: Number,
    scrolling: Boolean
  }
});

export const Visit = mongoose.model('Visit', visitSchema);
