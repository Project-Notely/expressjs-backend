type Environment = 'development' | 'test' | 'production';

interface EnvironmentConfig {
  mongodb: {
    uri: string;
    options: {
      dbName: string;
    };
  };
  server: {
    port: number;
  };
  auth0: {
    domain: string;
    audience: string;
  };
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = (process.env.NODE_ENV || 'development') as Environment;
  const isDev = env === 'development';
  const isTest = env === 'test';

  // Validate required environment variables
  const requiredEnvVars = [
    'MONGO_URI',
    'AUTH0_DOMAIN',
    'AUTH0_AUDIENCE'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    mongodb: {
      uri: process.env.MONGO_URI!,
      options: {
        dbName: isTest ? 'notely-test' : isDev ? 'notely-dev' : 'notely-prod'
      }
    },
    server: {
      port: parseInt(process.env.PORT || '3000')
    },
    auth0: {
      domain: process.env.AUTH0_DOMAIN!,
      audience: process.env.AUTH0_AUDIENCE!
    }
  };
};

export const config = getEnvironmentConfig();