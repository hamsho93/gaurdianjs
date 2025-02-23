import { GuardianConfig } from '../types';

export const defaultConfig: GuardianConfig = {
  endpoint: 'http://localhost:3000/track',
  trackingEnabled: true,
  detectionThreshold: 0.8,
  trackingInterval: 1000,
  bufferSize: 10,
  useTLS: true,
  useBehavior: true,
  threshold: 0.7,
  enableBehaviorAnalysis: true,
  customRules: []
}; 