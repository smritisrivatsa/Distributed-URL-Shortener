import { createClient } from '@clickhouse/client';

const client = createClient({
  url: process.env.CLICKHOUSE_HOST,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
});

export async function insertClick(event) {
  await client.insert({
    table: 'clicks',
    values: [{
      shortCode: event.shortCode,
      longUrl: event.longUrl,
      timestamp: event.timestamp,
      userAgent: event.userAgent || '',
      ip: event.ip || '',
    }],
    format: 'JSONEachRow',
  });
}