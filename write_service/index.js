import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createShortUrl } from "./src/urlService.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://snip-it.click',
    'https://frontend-xi-mauve-85.vercel.app',
    'https://frontend-g9wjyqmhm-url-shortener.vercel.app'
  ]
}));

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = await createShortUrl(longUrl);
  res.json({ shortCode });
});

app.listen(3001, () => console.log('Write service running at http://localhost:3001'));