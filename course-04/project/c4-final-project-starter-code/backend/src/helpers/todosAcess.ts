import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosByUserIndex = process.env.TODOS_TABLE_USER_ID_INDEX
  ) {}
    
  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Get all todos for user ${userId}`)
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {':userId': userId},
    }).promise()
        
    return result.Items as TodoItem[]
  }
      
  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Create new todo')
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
      
    return todoItem
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    logger.info(`Get todo ${todoId}`)
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
    logger.info(`Update todo ${todoId}`)
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

  async deleteTodo(todoId: string) {
    logger.info(`Delete todo ${todoId}`)
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId
      }
    }).promise()    
  }

  async updateAttachmentUrl(todoId: string, attachmentUrl: string) {
    logger.info(`Update attachment url ${todoId}`)
    await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId},
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {':attachmentUrl': attachmentUrl}
    }).promise()
  }
  
}