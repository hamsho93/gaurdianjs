"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBehavior = exports.BehaviorAnalyzer = void 0;
class BehaviorAnalyzer {
    constructor() {
        this.patterns = [];
        this.anomalies = [];
    }
    analyze(data) {
        // Initial analysis for new sessions
        if (!data || Object.keys(data).length === 0) {
            return {
                score: 0.5,
                patterns: [{
                        mouseMovements: null,
                        scrollPatterns: null,
                        interactionSpeed: null
                    }],
                anomalies: [],
                isBot: false,
                confidence: 0.5,
                mouseMovements: 0,
                keystrokes: 0,
                timeOnPage: 0,
                scrolling: false
            };
        }
        // Analyze existing session data
        return {
            score: 0,
            patterns: [{
                    mouseMovements: 0,
                    scrollPatterns: 0,
                    interactionSpeed: 0
                }],
            anomalies: [],
            isBot: false,
            confidence: 0,
            mouseMovements: 0,
            keystrokes: 0,
            timeOnPage: 0,
            scrolling: false
        };
    }
}
exports.BehaviorAnalyzer = BehaviorAnalyzer;
const analyzeBehavior = (req) => {
    const analyzer = new BehaviorAnalyzer();
    return Promise.resolve(analyzer.analyze(req));
};
exports.analyzeBehavior = analyzeBehavior;
