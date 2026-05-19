import 'dotenv/config';
<<<<<<< Updated upstream
import base62 from "base62/lib/ascii.js";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const db = DynamoDBDocumentClient.from(client);

const FEISTEL_KEYS = [0x12f4a3c1, 0x9b3e7d2f, 0x4c8a1e6b];

function feistelRound(value, key) {
  // Simple mixing function
  let x = value ^ key;
  x = ((x >>> 16) ^ x) * 0x45d9f3b | 0;
  x = ((x >>> 16) ^ x);
  return x >>> 0; // keep unsigned
}

function shuffle(id) {
  // Split 32-bit id into two 16-bit halves
  let left  = (id >>> 16) & 0xFFFF;
  let right = id & 0xFFFF;

  for (const key of FEISTEL_KEYS) {
    const newRight = left ^ feistelRound(right, key);
    left = right;
    right = newRight;
  }

  return ((left << 16) | right) >>> 0;
}

async function createShortUrl(longUrl) {
  // 1. Get next unique ID atomically
  const result = await db.send(new UpdateCommand({
    TableName: "counters",
    Key: { counterId: "url_counter" },
    UpdateExpression: "ADD #count :inc",
    ExpressionAttributeNames: { "#count": "count" },
    ExpressionAttributeValues: { ":inc": 1 },
    ReturnValues: "UPDATED_NEW",
  }));

  const id = result.Attributes.count;

  // 2. Shuffle + encode
  const shuffled = shuffle(id);
  const shortCode = base62.encode(shuffled);

  // 3. Store the URL
  await db.send(new PutCommand({
    TableName: "urls",
    Item: {
      shortCode,
      longUrl,
      createdAt: new Date().toISOString(),
    }
  }));

  return shortCode;
}

createShortUrl('https://systemdsdfsesignschool.io/problems/url-shortener/solution');
=======
import { createShortUrl } from "./src/urlService.js";
import express from 'express';

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

// const shortCode = await createShortUrl('https://universityofwashingtonhfs8.humanity.com/app/staff/detail/8759105/');
// console.log("Short code:", shortCode);
>>>>>>> Stashed changes
