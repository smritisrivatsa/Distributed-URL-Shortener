import 'dotenv/config';
import express from 'express';
import { createShortUrl } from "./src/urlService.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = await createShortUrl(longUrl);
  res.json({ shortCode });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

// commit 