import dotenv from 'dotenv';
import type { ConnectOptions } from 'mongoose';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' 
  ? '.env.test'
  : process.env.NODE_ENV === 'production'
  ? '.env.prod'
  : '.env';

dotenv.config({ path: envFile });

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