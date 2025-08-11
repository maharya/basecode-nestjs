import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.CACHE_HOST,
  port: process.env.CACHE_PORT,
  prefix: process.env.CACHE_PREFIX,
  ttl: process.env.CACHE_TTL,
  password: process.env.CACHE_PASSWORD,
  tls: process.env.CACHE_TLS === 'true',
}));
