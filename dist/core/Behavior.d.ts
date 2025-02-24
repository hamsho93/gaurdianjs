import { BehaviorAnalysis } from '../types';
export declare class BehaviorAnalyzer {
    private patterns;
    private anomalies;
    analyze(data: any): BehaviorAnalysis;
}
export declare const analyzeBehavior: (req: any) => Promise<BehaviorAnalysis>;
