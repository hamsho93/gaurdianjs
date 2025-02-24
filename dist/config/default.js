"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.defaultConfig = {
    endpoint: 'https://api.guardian.example.com',
    trackingEnabled: true,
    detectionThreshold: 0.5,
    trackingInterval: 1000,
    bufferSize: 1000,
    useTLS: true,
    useBehavior: true,
    threshold: 0.8,
    enableBehaviorAnalysis: true,
    customRules: []
};
exports.default = exports.defaultConfig;
