import fetch from 'node-fetch';
import { DetectionResult, BotDetectionParams } from '../types';

export class GuardianClient {
  private apiUrl: string;
  
  constructor(apiUrl = 'http://localhost:3333') {
    this.apiUrl = apiUrl;
  }
  
  async detectBot(params: BotDetectionParams): Promise<DetectionResult> {
    try {
      const response = await fetch(`${this.apiUrl}/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error detecting bot:', error);
      throw error;
    }
  }
  
  // Express middleware
  middleware() {
    return async (req: any, res: any, next: any) => {
      try {
        const result = await this.detectBot({
          userAgent: req.headers['user-agent'] || '',
          ip: req.ip || '',
          req: { path: req.path }
        });
        
        req.botDetection = result;
        next();
      } catch (error) {
        console.error('GuardianJS error:', error);
        next();
      }
    };
  }
}
