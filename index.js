import 'dotenv/config';
import express from 'express';
import { createShortUrl, getOriginalUrl } from "./src/urlService.js";
import { getCachedUrl, insertUrl } from './src/cache.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = await createShortUrl(longUrl);
  res.json({ shortCode });
});

/*
 * Check if cache has this shortCode
 * If it does, redirect to the corresponding longUrl
 * If it doesn't,
  * Check if dynamo has this shortCode
  * If it does, 
    * Update cache to have this shortCode, longUrl pair
    * Redirect to the corresponding longUrl
  * If it doesn't, throw some error "short code not found"
*/
app.get("/:shortCode", async (req, res) => {
  const longUrlRedis = await getCachedUrl(req.params.shortCode);
  if (longUrlRedis) {
    res.redirect(302, longUrlRedis);
  } else {
    const longUrlDynamo = await getOriginalUrl(req.params.shortCode);
    if (longUrlDynamo) {
      insertUrl(req.params.shortCode, longUrlDynamo);
      res.redirect(302, longUrlDynamo);
    } else {
      return res.status(404).send("Not found");
    }
  }





  
  

  if (!longUrl) return res.status(404).send("Not found");

  res.redirect(302, longUrl);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});