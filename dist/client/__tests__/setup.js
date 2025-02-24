"use strict";
// Mock fetch globally
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
}));
// Mock console methods
global.console = Object.assign(Object.assign({}, console), { error: jest.fn(), warn: jest.fn(), log: jest.fn() });
// Use fake timers
jest.useFakeTimers();
// Cleanup
afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
});
afterAll(() => {
    jest.useRealTimers();
});
