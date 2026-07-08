import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createShortUrl } from "./src/urlService.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = await createShortUrl(longUrl);
  res.json({ shortCode });
});

app.listen(3001, () => console.log('Write service running at http://localhost:3001'));