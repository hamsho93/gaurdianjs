export interface TLSAnalysis {
  isSuspicious: boolean;
  fingerprint: string;
}

export async function analyzeTLS(req: any): Promise<TLSAnalysis> {
  try {
    const cert = req.socket?.getPeerCertificate?.();
    return {
      isSuspicious: false,
      fingerprint: cert?.fingerprint || 'unknown'
    };
  } catch (error) {
    return {
      isSuspicious: false,
      fingerprint: 'unknown'
    };
  }
}
