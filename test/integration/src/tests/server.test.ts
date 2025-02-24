import request from 'supertest';
import app from '../server';
import { initDatabase } from '../database';

beforeAll(async () => {
  await initDatabase();
});

describe('Server Tests', () => {
  test('GET /test returns correct message', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Guardian Test Server Running' });
  });

  describe('POST /check-bot', () => {
    test('handles normal browser with standard user agent', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
        .set('X-Forwarded-For', '127.0.0.1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot', false);
    });

    test('identifies Googlebot correctly', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', 'Googlebot/2.1')
        .set('X-Forwarded-For', '127.0.0.1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot', true);
    });

    test('handles missing User-Agent header', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('X-Forwarded-For', '127.0.0.1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot');
    });

    test('handles missing IP address', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot');
    });

    test('identifies other known bots', async () => {
      const knownBots = [
        // Standard search engine bots with complete user agent strings
        {
          name: 'Googlebot',
          userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        },
        {
          name: 'Bingbot',
          userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        },
        {
          name: 'GoogleAdsBot',
          userAgent: 'AdsBot-Google (+http://www.google.com/adsbot.html)'
        }
      ];

      for (const bot of knownBots) {
        const response = await request(app)
          .post('/check-bot')
          .set('User-Agent', bot.userAgent)
          .set('X-Forwarded-For', '127.0.0.1');
        
        expect(response.status).toBe(200);
        console.log(`Testing ${bot.name}: ${response.body.isBot ? 'detected' : 'not detected'}`);
        expect(response.body).toHaveProperty('isBot', true);
      }
    });

    test('handles mobile user agents', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1')
        .set('X-Forwarded-For', '127.0.0.1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot', false);
    });

    test('handles malformed requests gracefully', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', '')
        .set('X-Forwarded-For', 'invalid-ip');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot');
    });

    test('identifies LLM-based bots correctly', async () => {
      const llmBots = [
        {
          name: 'GPTBot',
          userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.0; +https://openai.com/gptbot)'
        },
        {
          name: 'ChatGPT-User',
          userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot'
        },
        {
          name: 'OAI-SearchBot',
          userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot'
        }
      ];

      for (const bot of llmBots) {
        const response = await request(app)
          .post('/check-bot')
          .set('User-Agent', bot.userAgent)
          .set('X-Forwarded-For', '127.0.0.1');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isBot', true);
        console.log(`${bot.name} detected as bot:`, response.body.isBot);
      }
    });

    test('handles common crawler patterns', async () => {
      const crawlerAgents = [
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Mozilla/5.0 (compatible; AdsBot-Google; +http://www.google.com/adsbot.html)',
        'Mozilla/5.0 (compatible; DuckDuckBot/1.0; +http://duckduckgo.com/duckduckbot.html)'
      ];

      for (const agent of crawlerAgents) {
        const response = await request(app)
          .post('/check-bot')
          .set('User-Agent', agent)
          .set('X-Forwarded-For', '127.0.0.1');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('isBot', true);
      }
    });

    test('handles special characters in user agents', async () => {
      const response = await request(app)
        .post('/check-bot')
        .set('User-Agent', 'Mozilla/5.0 (compatible; Bot-Name/1.0; +http://example.com/bot)')
        .set('X-Forwarded-For', '127.0.0.1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isBot');
    });

    test('identifies search engine bots', async () => {
      const searchBots = [
        {
          name: 'Googlebot Mobile',
          userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        },
        {
          name: 'Bingbot Mobile',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        }
      ];

      for (const bot of searchBots) {
        const response = await request(app)
          .post('/check-bot')
          .set('User-Agent', bot.userAgent)
          .set('X-Forwarded-For', '127.0.0.1');
        
        expect(response.status).toBe(200);
        console.log(`Testing ${bot.name}: ${response.body.isBot ? 'detected' : 'not detected'}`);
        expect(response.body).toHaveProperty('isBot', true);
      }
    });
  });
});
