import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

const TTL = 60 * 60;

export async function getCachedUrl(shortCode) {
  const longUrl = await redis.get(shortCode);
  return longUrl;
}

export async function insertUrl(shortCode, longUrl) {
  const status = await redis.set(shortCode, longUrl);
  return status;
}