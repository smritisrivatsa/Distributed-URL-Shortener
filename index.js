import 'dotenv/config';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });
const db = DynamoDBDocumentClient.from(client);

await db.send(new PutCommand({
  TableName: "urls",
  Item: {
    shortCode: "aB3x9k",
    longUrl: "https://google.com",
    createdAt: new Date().toISOString(),
  }
}));