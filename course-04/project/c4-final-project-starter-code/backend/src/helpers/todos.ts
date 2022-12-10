import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('todos')
const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info(`Get all todos for user ${userId}`)
    return await todoAccess.getAllTodos(userId)
}

export async function createTodoItem(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {  
    logger.info(`Create new todo for user ${userId}`)
    const newItem = {
        userId,
        todoId: uuid.v4(),
        createdAt: new Date().toISOString(),
        name: newTodo.name || 'New Todo',
        dueDate: new Date(Date.parse(newTodo.dueDate)).toISOString(),
        done: false,
        attachmentUrl: 'default'
      }
    return await todoAccess.createTodoItem(newItem)
  }