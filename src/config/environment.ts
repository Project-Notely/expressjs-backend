import dotenv from 'dotenv';
import type { ConnectOptions } from 'mongoose';

// load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test'
    ? '.env.test'
    : process.env.NODE_ENV === 'development'
        ? '.env.dev'
        : '.env.prod';

dotenv.config({ path: envFile });

// validate required env vars
const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_AUDIENCE'
]

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variables: ${envVar}`);
    }
}

export {};

// export config object
export const config = {
    mongodb: {
        uri: process.env.MONGO_URI || '',
        options: {
            retryWrites: true,
            w: 'majority',
        } satisfies ConnectOptions
    },
    server: {
        port: process.env.PORT || 3001
    }
};