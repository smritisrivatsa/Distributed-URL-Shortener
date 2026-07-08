import { db } from "../db.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";


export async function getOriginalUrl(shortCode) {
  const result = await db.send(new GetCommand({
    TableName: "urls",
    Key: { shortCode },
  }));

  if (!result.Item) return null;

  return result.Item.longUrl;
}