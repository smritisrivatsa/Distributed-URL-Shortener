import 'dotenv/config';
import base62 from "base62/lib/ascii.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createShortUrl } from "./src/urlService.js";
import express from 'express';

const shortCode = await createShortUrl('https://universityofwashingtonhfs8.humanity.com/app/staff/detail/8759105/');
console.log("Short code:", shortCode);

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
