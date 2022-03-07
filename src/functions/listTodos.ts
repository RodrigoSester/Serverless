import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";


export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters

  const user = await document.query({
    TableName: "user_todos",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: { ":user_id": id }
  }).promise();

  console.log(`${JSON.stringify(user.Items[0].id)} maggy`)

  if(!user) return { statusCode: 400, body: "Usuário não existe" }

  return {
    statusCode: 200,
    body: JSON.stringify(user.Items)
  }
}