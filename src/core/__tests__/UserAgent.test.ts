import { analyzeUA } from '../UserAgent';

describe('UserAgent Analysis', () => {
  test('should detect bot user agents', () => {
    const botUAs = [
      'Googlebot/2.1 (+http://www.google.com/bot.html)',
      'Baiduspider+(+http://www.baidu.com/search/spider.htm)',
      'Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)'
    ];

    botUAs.forEach(ua => {
      const result = analyzeUA(ua);
      expect(result.isBot).toBe(true);
    });
  });

  test('should identify regular browsers', () => {
    const browserUAs = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
    ];

    browserUAs.forEach(ua => {
      const result = analyzeUA(ua);
      expect(result.isBot).toBe(false);
    });
  });

  test('should handle empty user agent string', () => {
    const result = analyzeUA('');
    expect(result).toEqual({
      isBot: false,
      browser: 'unknown',
      os: 'unknown',
      device: 'desktop'
    });
  });

  test('should detect browser details', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const result = analyzeUA(ua);
    
    expect(result.browser).toBe('Chrome');
    expect(result.os).toBe('Mac OS');
    expect(result.device).toBe('desktop');
  });
}); 