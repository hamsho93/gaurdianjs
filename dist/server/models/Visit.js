"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const visitSchema = new mongoose_1.default.Schema({
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
exports.Visit = mongoose_1.default.model('Visit', visitSchema);
