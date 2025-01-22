import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export class TestDatabase {
    private mongod: MongoMemoryServer | null = null;

    async connect(): Promise<void> {
        this.mongod = await MongoMemoryServer.create();
        const uri = this.mongod.getUri();
        await mongoose.connect(uri);
    }

    async disconnect(): Promise<void> {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (this.mongod) {
            await this.mongod.stop();
        }
    }

    async cleanup(): Promise<void> {
        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.collections();
            await Promise.all(
                collections.map(collection => collection.deleteMany({}))
            );
        }
    }
}