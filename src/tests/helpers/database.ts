import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const setupTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    maxPoolSize: 10,
  });
};

export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};

export const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = await mongoose.connection.db?.collections();
    if (!collections) throw new Error("No collections found");
    await Promise.all(collections.map(c => c.deleteMany({})));
  }
};