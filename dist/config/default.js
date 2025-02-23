"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    endpoint: 'http://localhost:3000/track',
    trackingEnabled: true,
    detectionThreshold: 0.8,
    trackingInterval: 1000,
    bufferSize: 10,
    useTLS: true,
    useBehavior: true,
    threshold: 0.7,
    enableBehaviorAnalysis: true,
    customRules: []
};
