import { createClient } from '@clickhouse/client';

const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
});

export async function getTopUrls() {
  const result = await client.query({
    query: `SELECT shortCode, longUrl, COUNT(*) as clicks
            FROM clicks
            GROUP BY shortCode, longUrl
            ORDER BY clicks DESC
            LIMIT 10`,
    format: 'JSONEachRow',
  });
  return await result.json();
}

export async function getClicksOverTime() {
  const result = await client.query({
    query: `SELECT toStartOfHour(timestamp) as hour, COUNT(*) as clicks
            FROM clicks
            GROUP BY hour
            ORDER BY hour ASC`,
    format: 'JSONEachRow',
  });
  return await result.json();
}

export async function getRecentClicks() {
  const result = await client.query({
    query: `SELECT shortCode, longUrl, timestamp, ip, userAgent
            FROM clicks
            ORDER BY timestamp DESC
            LIMIT 20`,
    format: 'JSONEachRow',
  });
  return await result.json();
}