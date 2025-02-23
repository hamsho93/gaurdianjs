import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Close existing connections
  await mongoose.disconnect();
  
  // Create new memory server
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connect to memory server
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Cleanup
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}); 