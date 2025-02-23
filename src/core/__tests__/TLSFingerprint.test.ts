import { analyzeTLS } from '../TLSFingerprint';

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
    const result = await analyzeTLS(mockReq);
    expect(result.fingerprint).toBe('valid_fingerprint');
    expect(result.isSuspicious).toBe(false);
  });

  test('should handle missing TLS data', async () => {
    const mockReqNoTLS = {
      connection: {}
    };
    const result = await analyzeTLS(mockReqNoTLS);
    expect(result.fingerprint).toBe('unknown');
    expect(result.isSuspicious).toBe(false);
  });

  test('should handle null socket', async () => {
    const mockReqNoSocket = {};
    const result = await analyzeTLS(mockReqNoSocket);
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
    const result = await analyzeTLS(mockReqError);
    expect(result.fingerprint).toBe('unknown');
    expect(result.isSuspicious).toBe(false);
  });
}); 