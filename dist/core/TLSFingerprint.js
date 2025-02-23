"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTLS = analyzeTLS;
async function analyzeTLS(req) {
    var _a, _b;
    try {
        const socket = req === null || req === void 0 ? void 0 : req.connection;
        if (!(socket === null || socket === void 0 ? void 0 : socket.getTLSFingerprint)) {
            return {
                score: 0,
                fingerprint: 'unknown',
                version: 'unknown',
                isSuspicious: false
            };
        }
        try {
            const fingerprint = socket.getTLSFingerprint();
            const version = ((_b = (_a = socket.getPeerCertificate) === null || _a === void 0 ? void 0 : _a.call(socket)) === null || _b === void 0 ? void 0 : _b.version) || '1.2';
            return {
                score: 0.5,
                fingerprint,
                version,
                isSuspicious: false
            };
        }
        catch (error) {
            return {
                score: 0,
                fingerprint: 'unknown',
                version: 'unknown',
                isSuspicious: false
            };
        }
    }
    catch (error) {
        return {
            score: 0,
            fingerprint: 'unknown',
            version: 'unknown',
            isSuspicious: false
        };
    }
}
