import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { config } from '@/config/environment';

let mongod: MongoMemoryServer;

beforeAll(async () => {
    // Ensure we're in test environment
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Tests must be run in test environment');
    }

    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, {
        ...config.mongodb.options
    });
    console.log(`Test database connected: ${mongoose.connection.db?.databaseName}`);
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
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        await Promise.all(collections.map(collection => collection.deleteMany({})));
    }
});