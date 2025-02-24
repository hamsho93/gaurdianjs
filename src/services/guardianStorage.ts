// src/services/guardianStorage.ts
import { GuardianJS } from '../core/GuardianJS';
import { DetectionResult } from '../types';

export class GuardianStorage {
  private guardian: GuardianJS;
  private database: {
    detections: DetectionResult[];
  };

  constructor() {
    this.guardian = new GuardianJS();
    this.database = {
      detections: []
    };
  }

  async detectBot(params: { userAgent: string; ip: string; req?: any }) {
    return this.guardian.isBot(params);
  }

  async storeDetection(detection: DetectionResult) {
    this.database.detections.push(detection);
  }

  async getDetections(): Promise<DetectionResult[]> {
    return this.database.detections.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }
}

export const guardianStorage = new GuardianStorage();