import UAParser from 'ua-parser-js';

export interface UAAnalysis {
  isBot: boolean;
  browser: string;
  os: string;
  device: string;
}

export function analyzeUA(userAgent: string): UAAnalysis {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  
  const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
  
  return {
    isBot,
    browser: result.browser.name || 'unknown',
    os: result.os.name || 'unknown',
    device: result.device.type || 'desktop'
  };
}
