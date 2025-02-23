export * from '../index';

export interface GuardianConfig {
  endpoint: string;
  trackingEnabled?: boolean;
  detectionThreshold?: number;
  trackingInterval?: number;
  bufferSize?: number;
}

export interface TrackingEvent {
  event: string;
  path?: string;
  timestamp?: number;
  [key: string]: any;
} 