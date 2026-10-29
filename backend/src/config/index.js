import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'sushrut_dev_access_token_secret_2026',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'sushrut_dev_refresh_token_secret_2026',
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  },
  storage: {
    provider: process.env.FILE_STORAGE_PROVIDER || 'local',
    localPath: process.env.LOCAL_STORAGE_PATH || '../storage',
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET || 'sushrut-documents',
      region: process.env.S3_REGION || 'ap-south-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  }
};
