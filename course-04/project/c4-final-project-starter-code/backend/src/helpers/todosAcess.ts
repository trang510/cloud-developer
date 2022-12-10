import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByUserIndex = process.env.TODOS_BY_USER_INDEX
  ) {}
    

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {':userId': userId},
    }).promise()
        
    return result.Items as TodoItem[]
  }
      
  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
      
    return todoItem
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    const todoItem = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId,
      }
    }).promise()
    
    const item = todoItem.Item
    return item as TodoItem
  }  

  async updateTodo(todoId: string, todoUpdate: TodoUpdate): Promise<void> {
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "todoId": todoId
      },
      UpdateExpression: "set #name=:name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues:{
          ":name": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    }).promise()    
  }


   
    
}