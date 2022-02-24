import { APIGatewayProxyHandler } from "aws-lambda"
import { v4 as uuidv4 } from 'uuid'
import { S3 } from "aws-sdk"
import { document } from "../utils/dynamodbClient"

interface ITodo {
  title: string
  deadline: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters
  const { title, deadline } = JSON.parse(event.body) as ITodo
  
  await document.query({
    TableName: "user_todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise()

  const todo = {
    id: uuidv4(),
    user_id: id,
    title,
    done: false,
    deadline
  }
  
  await document.put({
    TableName: "user_todos",
    Item: todo
  }).promise()

  
  const s3 = new S3()
  /*
  await s3.createBucket({
    Bucket: "todoIgnite"
  }).promise()
  */

  await s3.putObject({
    Bucket: "todoignite",
    Key: id
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Todo criado com sucesso",
      id: todo.id
    })
  }
}