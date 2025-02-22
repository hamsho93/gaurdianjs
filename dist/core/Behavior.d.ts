export interface BehaviorAnalysis {
    isBot: boolean;
    confidence: number;
    patterns: {
        mouseMovements: number;
        scrollPatterns: number;
        interactionSpeed: number;
    };
}
export declare function analyzeBehavior(req: any): Promise<BehaviorAnalysis>;
