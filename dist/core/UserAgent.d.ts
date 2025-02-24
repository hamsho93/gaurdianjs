import UAParser from 'ua-parser-js';
export interface UAAnalysis {
    isBot: boolean;
    browser: string;
    os: string;
    device: string;
}
export declare function analyzeUA(userAgent: string): UAAnalysis;
export declare class UserAgentAnalyzer {
    private parser;
    constructor();
    analyze(userAgent: string): UAParser.IResult;
}
