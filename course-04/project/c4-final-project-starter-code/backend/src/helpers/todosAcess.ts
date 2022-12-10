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
      
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: todoItem
      }).promise()
      
      return todoItem
    }    
    
}