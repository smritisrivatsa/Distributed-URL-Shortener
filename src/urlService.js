import { db } from "./db.js";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { getNextCount } from "./counter.js";
import { generateShortCode } from "./encode.js";

export async function createShortUrl(longUrl) {
  const count = await getNextCount();
  const shortCode = generateShortCode(count);

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

export async function getOriginalUrl(shortCode) {
  const result = await db.send(new GetCommand({
    TableName: "urls",
    Key: { shortCode },
  }));

  if (!result.Item) return null;

  return result.Item.longUrl;
}