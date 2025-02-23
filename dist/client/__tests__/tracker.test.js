"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracker_1 = require("../tracker");
describe('GuardianTracker', () => {
    const config = {
        endpoint: 'test-endpoint',
        bufferSize: 5,
        flushInterval: 1000
    };
    test('can be instantiated with config', () => {
        const tracker = new tracker_1.GuardianTracker(config);
        expect(tracker).toBeTruthy();
        expect(tracker.getEndpoint()).toBe('test-endpoint');
    });
    test('uses default values when not provided', () => {
        const minimalConfig = {
            endpoint: 'test-endpoint'
        };
        const tracker = new tracker_1.GuardianTracker(minimalConfig);
        expect(tracker).toBeTruthy();
        expect(tracker.getEndpoint()).toBe('test-endpoint');
    });
});
