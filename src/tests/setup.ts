import mongoose from 'mongoose';
import { config } from '@/config/environment';

beforeAll(async () => {
    // check we're in test environment
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Tests must be run in test environment');
    }

    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log(`Test database connected: ${mongoose.connection.db?.databaseName}`);
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
});

afterEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        await Promise.all(collections.map(collection => collection.deleteMany({})));
    }
});