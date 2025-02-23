import { TLSAnalysis } from '../types';

export async function analyzeTLS(req: any): Promise<TLSAnalysis> {
  try {
    const socket = req?.connection;
    
    if (!socket?.getTLSFingerprint) {
      return {
        score: 0,
        fingerprint: 'unknown',
        version: 'unknown',
        isSuspicious: false
      };
    }

    try {
      const fingerprint = socket.getTLSFingerprint();
      const version = socket.getPeerCertificate?.()?.version || '1.2';

      return {
        score: 0.5,
        fingerprint,
        version,
        isSuspicious: false
      };
    } catch (error) {
      return {
        score: 0,
        fingerprint: 'unknown',
        version: 'unknown',
        isSuspicious: false
      };
    }
  } catch (error) {
    return {
      score: 0,
      fingerprint: 'unknown',
      version: 'unknown',
      isSuspicious: false
    };
  }
}
