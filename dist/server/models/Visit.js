"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const visitSchema = new mongoose_1.default.Schema({
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
        anomalies: [mongoose_1.default.Schema.Types.Mixed],
        isBot: Boolean,
        confidence: Number
    }
});
exports.Visit = mongoose_1.default.model('Visit', visitSchema);
