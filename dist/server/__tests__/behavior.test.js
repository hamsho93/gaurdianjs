"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const behavior_1 = require("../services/behavior");
describe('Behavior Analysis', () => {
    test('detects bot-like mouse movements', () => {
        const events = [
            {
                type: 'mousemove',
                data: { x: 0, y: 0 },
                timestamp: 0
            },
            {
                type: 'mousemove',
                data: { x: 50, y: 50 },
                timestamp: 100
            },
            {
                type: 'mousemove',
                data: { x: 100, y: 100 },
                timestamp: 200
            }
        ];
        const result = (0, behavior_1.analyzeBehavior)(events);
        expect(result.isBot).toBe(true);
        expect(result.confidence).toBeGreaterThan(0.7);
    });
    test('recognizes human-like behavior', () => {
        const events = [
            {
                type: 'mousemove',
                data: { x: 100, y: 100 },
                timestamp: 0
            },
            {
                type: 'mousemove',
                data: { x: 103, y: 98 },
                timestamp: 50
            },
            {
                type: 'click',
                data: { x: 105, y: 102 },
                timestamp: 500
            }
        ];
        const result = (0, behavior_1.analyzeBehavior)(events);
        expect(result.isBot).toBe(false);
        expect(result.confidence).toBeLessThan(0.7);
    });
});
