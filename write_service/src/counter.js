import { db } from "../db.js";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function getNextCount() {
  const result = await db.send(new UpdateCommand({
    TableName: "counters",
    Key: { counterId: "url_counter" },
    UpdateExpression: "ADD #count :inc",
    ExpressionAttributeNames: { "#count": "count" },
    ExpressionAttributeValues: { ":inc": 1 },
    ReturnValues: "UPDATED_NEW",
  }));
  return result.Attributes.count;
}