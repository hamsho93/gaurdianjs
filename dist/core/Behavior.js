"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBehavior = analyzeBehavior;
async function analyzeBehavior(req) {
    return {
        score: 0.5,
        patterns: [],
        anomalies: [],
        isBot: false,
        confidence: 0.8
    };
}
