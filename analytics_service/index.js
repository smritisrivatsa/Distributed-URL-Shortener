import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectConsumer } from './src/kafka.js';
import { insertClick } from './src/clickhouse.js';
import { getTopUrls, getClicksOverTime, getRecentClicks } from './src/queries.js';

const app = express();
app.use(cors({ origin: ['http://localhost:3000', 'https://snip-it.click'] }));

app.get('/health', (req, res) => res.status(200).send('ok'));

app.get('/analytics/top-urls', async (req, res) => {
  const data = await getTopUrls();
  res.json(data);
});

app.get('/analytics/clicks-over-time', async (req, res) => {
  const data = await getClicksOverTime();
  res.json(data);
});

app.get('/analytics/recent-clicks', async (req, res) => {
  const data = await getRecentClicks();
  res.json(data);
});

app.listen(3003, () => console.log('Analytics service running at http://localhost:3003'));

await connectConsumer(async (event) => {
  console.log('Received click event:', event.shortCode);
  await insertClick(event);
});