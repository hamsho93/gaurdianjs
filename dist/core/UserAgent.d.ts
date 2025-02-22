export interface UAAnalysis {
    isBot: boolean;
    browser: string;
    os: string;
    device: string;
}
export declare function analyzeUA(userAgent: string): UAAnalysis;
