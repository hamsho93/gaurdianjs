"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TLSFingerprint_1 = require("../TLSFingerprint");
describe('TLS Fingerprint Analysis', () => {
    const mockReq = {
        connection: {
            getTLSFingerprint: () => 'valid_fingerprint',
            getPeerCertificate: () => ({
                version: '1.2'
            })
        }
    };
    test('should analyze valid TLS connection', async () => {
        const result = await (0, TLSFingerprint_1.analyzeTLS)(mockReq);
        expect(result.fingerprint).toBe('valid_fingerprint');
        expect(result.isSuspicious).toBe(false);
    });
    test('should handle missing TLS data', async () => {
        const mockReqNoTLS = {
            connection: {}
        };
        const result = await (0, TLSFingerprint_1.analyzeTLS)(mockReqNoTLS);
        expect(result.fingerprint).toBe('unknown');
        expect(result.isSuspicious).toBe(false);
    });
    test('should handle null socket', async () => {
        const mockReqNoSocket = {};
        const result = await (0, TLSFingerprint_1.analyzeTLS)(mockReqNoSocket);
        expect(result.fingerprint).toBe('unknown');
        expect(result.isSuspicious).toBe(false);
    });
    test('should handle getPeerCertificate throwing error', async () => {
        const mockReqError = {
            connection: {
                getTLSFingerprint: () => {
                    throw new Error('TLS Error');
                }
            }
        };
        const result = await (0, TLSFingerprint_1.analyzeTLS)(mockReqError);
        expect(result.fingerprint).toBe('unknown');
        expect(result.isSuspicious).toBe(false);
    });
});
