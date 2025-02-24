"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const default_1 = require("../config/default");
function validateConfig(config) {
    return Object.assign(Object.assign({}, default_1.defaultConfig), config);
}
exports.validateConfig = validateConfig;
const validateArrays = (list) => {
    if (!Array.isArray(list.ips)) {
        throw new Error('IPs must be an array');
    }
    if (!Array.isArray(list.userAgents)) {
        throw new Error('UserAgents must be an array');
    }
    if (list.paths && !Array.isArray(list.paths)) {
        throw new Error('Paths must be an array');
    }
    if (list.patterns && !Array.isArray(list.patterns)) {
        throw new Error('Patterns must be an array');
    }
};
const validateCustomRule = (rule) => {
    if (typeof rule.name !== 'string') {
        throw new Error('Custom rule name must be a string');
    }
    if (typeof rule.condition !== 'function') {
        throw new Error('Custom rule condition must be a function');
    }
    if (typeof rule.weight !== 'number' || rule.weight < 0 || rule.weight > 1) {
        throw new Error('Custom rule weight must be a number between 0 and 1');
    }
};
