import { GuardianConfig } from '../types';
import { defaultConfig } from '../config/default';

export function validateConfig(config: Partial<GuardianConfig>): GuardianConfig {
  return {
    ...defaultConfig,
    ...config
  };
}

const validateArrays = (list: { ips: string[]; userAgents: string[]; paths?: string[]; patterns?: RegExp[] }) => {
  if (!Array.isArray(list.ips)) {
    throw new Error('IPs must be an array');
  }
  if (!Array.isArray(list.userAgents)) {
    throw new Error('UserAgents must be an array');
  }
  if (list.paths && !Array.isArray(list.paths)) {
    throw new Error('Paths must be an array');
  }
  if (list.patterns && !Array.isArray(list.patterns)) {
    throw new Error('Patterns must be an array');
  }
};

const validateCustomRule = (rule: any) => {
  if (typeof rule.name !== 'string') {
    throw new Error('Custom rule name must be a string');
  }
  if (typeof rule.condition !== 'function') {
    throw new Error('Custom rule condition must be a function');
  }
  if (typeof rule.weight !== 'number' || rule.weight < 0 || rule.weight > 1) {
    throw new Error('Custom rule weight must be a number between 0 and 1');
  }
}; 