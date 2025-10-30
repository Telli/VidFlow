import { Redis } from 'ioredis';

export function createRedisClients() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  const pub = new Redis(url);
  const sub = new Redis(url);
  return { pub, sub };
}

export function createRedis() {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  return new Redis(url);
}
