import { analyzeTLS } from '../TLSFingerprint';

describe('TLS Fingerprint Analysis', () => {
  const mockReq = {
    connection: {
      getTLSFingerprint: () => 'mock-fingerprint'
    }
  };

  test('should analyze normal TLS fingerprint', async () => {
    const result = await analyzeTLS(mockReq);
    expect(result.isSuspicious).toBe(false);
  });

  test('should analyze valid TLS connection', async () => {
    const mockReq = {
      socket: {
        getPeerCertificate: () => ({ fingerprint: 'valid_fingerprint' })
      }
    };

    const result = await analyzeTLS(mockReq);
    expect(result.fingerprint).toBe('valid_fingerprint');
    expect(result.isSuspicious).toBe(false);
  });

  test('should handle missing TLS data', async () => {
    const mockReq = {
      socket: {}
    };

    const result = await analyzeTLS(mockReq);
    expect(result.fingerprint).toBe('unknown');
    expect(result.isSuspicious).toBe(false);
  });

  test('should handle null socket', async () => {
    const mockReq = {};

    const result = await analyzeTLS(mockReq);
    expect(result.fingerprint).toBe('unknown');
    expect(result.isSuspicious).toBe(false);
  });

  test('should handle getPeerCertificate throwing error', async () => {
    const mockReq = {
      socket: {
        getPeerCertificate: () => {
          throw new Error('Certificate error');
        }
      }
    };

    const result = await analyzeTLS(mockReq);
    expect(result.fingerprint).toBe('unknown');
    expect(result.isSuspicious).toBe(false);
  });
}); 