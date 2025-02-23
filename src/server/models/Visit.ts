import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  target: String,
  timestamp: { type: Number, default: Date.now }
}, { _id: false, strict: false });

const visitSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  sessionId: { type: String, required: true },
  userAgent: String,
  isBot: { type: Boolean, default: false },
  events: [eventSchema]
}, { 
  timestamps: true,
  strict: false 
});

export const Visit = mongoose.model('Visit', visitSchema); 