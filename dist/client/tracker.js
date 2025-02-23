"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianTracker = void 0;
class GuardianTracker {
    constructor(config) {
        this.endpoint = config.endpoint;
        this.bufferSize = config.bufferSize || 10;
        this.flushInterval = config.flushInterval || 5000;
    }
    getEndpoint() {
        return this.endpoint;
    }
    addEvent(event) {
        // Implementation needed
    }
    destroy() {
        // Implementation needed
    }
}
exports.GuardianTracker = GuardianTracker;
// Most basic possible class
class Tracker {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
}
// Use CommonJS exports
module.exports = {
    GuardianTracker
};
