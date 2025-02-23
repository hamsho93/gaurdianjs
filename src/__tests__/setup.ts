import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Setup for MongoDB tests
let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Ensure we're disconnected before creating a new connection
  await mongoose.disconnect();
  
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    // Add mongoose connection options
    autoCreate: true,
    autoIndex: true,
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Setup for client-side tests
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  })
) as jest.Mock;

// Add other global mocks if needed
global.console = {
  ...console,
  // Customize console.error to not pollute test output
  error: jest.fn(),
  warn: jest.fn(),
}; 