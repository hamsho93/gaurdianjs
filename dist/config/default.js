"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    threshold: 0.8,
    enableBehaviorAnalysis: true,
    enableTLSFingerprinting: true,
    enableUserAgentAnalysis: true,
    timeoutMs: 5000,
    maxRequestsPerMinute: 100,
    whitelist: {
        ips: [],
        userAgents: [
            'GoogleBot',
            'Bingbot',
            'Slurp'
        ],
        paths: [
            '/health',
            '/metrics'
        ]
    },
    blacklist: {
        ips: [],
        userAgents: [],
        patterns: [
            /[<>]|javascript:|data:|about:|file:/i,
            /eval\(|alert\(|prompt\(|confirm\(/i
        ]
    }
};
