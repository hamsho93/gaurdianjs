export interface TLSAnalysis {
    isSuspicious: boolean;
    fingerprint: string;
}
export declare function analyzeTLS(req: any): Promise<TLSAnalysis>;
