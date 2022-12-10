import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';


const logger = createLogger('getTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing getTodo event: ", event)
    
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos
      })
    }
})

handler.use(
  cors({
    credentials: true
  })
)
