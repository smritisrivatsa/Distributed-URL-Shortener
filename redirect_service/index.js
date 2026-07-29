import 'dotenv/config';
import express from 'express';
import { getOriginalUrl } from "./src/urlService.js";
import { getCachedUrl, insertUrl } from './src/cache.js';
import { connectProducer, publishClickEvent } from './src/kafka.js';

const app = express();

await connectProducer();

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.get("/:shortCode", async (req, res) => {
  const longUrlRedis = await getCachedUrl(req.params.shortCode);
  if (longUrlRedis) {
    publishClickEvent(req.params.shortCode, longUrlRedis, req);
    return res.redirect(302, longUrlRedis);
  }

  const longUrlDynamo = await getOriginalUrl(req.params.shortCode);
  if (longUrlDynamo) {
    insertUrl(req.params.shortCode, longUrlDynamo);
    publishClickEvent(req.params.shortCode, longUrlDynamo, req);
    return res.redirect(302, longUrlDynamo);
  }

  return res.status(404).send("Not found");
});

app.listen(3002, () => console.log('Redirect service running at http://localhost:3002'));