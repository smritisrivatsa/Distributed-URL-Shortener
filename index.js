import 'dotenv/config';
import express from 'express';
import { createShortUrl, getOriginalUrl } from "./src/urlService.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortCode = await createShortUrl(longUrl);
  res.json({ shortCode });
});

app.get("/:shortCode", async (req, res) => {
  const longUrl = await getOriginalUrl(req.params.shortCode);

  if (!longUrl) return res.status(404).send("Not found");

  res.redirect(302, longUrl);
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});