import { closeServer } from '../middleware/express';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterEach(async () => {
  await closeServer();
  // Allow event loop to clear
  await new Promise(resolve => setTimeout(resolve, 100));
});

afterAll(async () => {
  await closeServer();
  // Allow event loop to clear
  await new Promise(resolve => setTimeout(resolve, 1000));
});

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
}); 