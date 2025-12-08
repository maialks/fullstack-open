import 'dotenv/config';

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? +process.env.PORT : 8080,
  DATABASE_URI: process.env.DATABASE_URI!,
  JWT_SECRET: process.env.JWT_SECRET || 'NEVER',
};
