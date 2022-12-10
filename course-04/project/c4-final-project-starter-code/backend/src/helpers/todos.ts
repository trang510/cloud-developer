import { TodoAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement businessLogic
const logger = createLogger('todos')
const todoAccess = new TodoAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  logger.info(`Get all todos for user ${userId}`)
  return await todoAccess.getAllTodos(userId)
}

export async function createTodo(userId: string, newTodo: CreateTodoRequest): Promise<TodoItem> {  
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
  return await todoAccess.createTodo(newItem)
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string) {
  logger.info(`Updating todo ${todoId}`)

  const item = await todoAccess.getTodo(todoId)

  if (!item)
    throw new Error('Todo not found')

    todoAccess.updateTodo(todoId, updateTodoRequest as TodoUpdate)
}

export async function deleteTodo(todoId: string) {
  logger.info(`Deleting todo ${todoId}`)

  const item = await todoAccess.getTodo(todoId)

  if (!item)
    throw new Error('Todo not found')

    todoAccess.deleteTodo(todoId)
}
