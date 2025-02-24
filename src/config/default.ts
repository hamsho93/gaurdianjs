import { GuardianConfig } from '../types';

export const defaultConfig = {
  endpoint: 'https://api.guardian.example.com',
  trackingEnabled: true,
  detectionThreshold: 0.5,
  trackingInterval: 1000,
  bufferSize: 1000,
  useTLS: true,
  useBehavior: true,
  threshold: 0.8,
  enableBehaviorAnalysis: true,
  customRules: []
};

export default defaultConfig;