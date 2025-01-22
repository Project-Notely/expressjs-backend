declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            MONGO_URI: string;
            AUTH0_DOMAIN: string;
            AUTH0_CLIENT_ID: string;
            AUTH0_CLIENT_SECRET: string;
            AUTH0_AUDIENCE: string;
            REDIS_HOST?: string;
            REDIS_PORT?: string;
            REDIS_PASSWORD?: string;
        }
    }
}

export { };