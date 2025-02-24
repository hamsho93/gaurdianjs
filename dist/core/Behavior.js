"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBehavior = void 0;
function analyzeBehavior(data = {}) {
    // Match demo server behavior structure (lines 93-98)
    return {
        mouseMovements: data.mouseMovements || 0,
        keystrokes: data.keystrokes || 0,
        timeOnPage: data.timeOnPage || 0,
        scrolling: data.scrolling || false
    };
}
exports.analyzeBehavior = analyzeBehavior;
