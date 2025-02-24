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

export class UserAgentAnalyzer {
  private parser: UAParser;

  constructor() {
    this.parser = new UAParser();
  }

  analyze(userAgent: string) {
    this.parser.setUA(userAgent);
    return this.parser.getResult();
  }
}
