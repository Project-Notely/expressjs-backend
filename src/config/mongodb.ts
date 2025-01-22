import mongoose from "mongoose";
import { config } from "./environment";

export const connectMongoDB = async (): Promise<void> => {
    try {
        const { uri, options } = config.mongodb;

        await mongoose.connect(uri, options);

        console.log(`MongoDB connected to database: ${mongoose.connection.db?.databaseName}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

        // Add event listeners for connection status
        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('MongoDB reconnected');
        });

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export const disconnectMongoDB = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};