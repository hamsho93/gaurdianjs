import { setupTestServer, teardownTestServer } from './serverUtils';

beforeAll(async () => {
  await setupTestServer();
});

afterAll(async () => {
  await teardownTestServer();
});

beforeEach(async () => {
  await setupTestServer();
});

afterEach(async () => {
  await teardownTestServer();
});

// Add error handler for unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
}); 