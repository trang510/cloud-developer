import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { generateUploadUrl, updateAttachmentUrl } from '../../helpers/todos'
// import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('generateUploadUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("Processing generateUploadUrl event: ", event)
    const todoId = event.pathParameters.todoId
    const attachmentId = uuid.v4()

    const url = await generateUploadUrl(attachmentId)

    await updateAttachmentUrl(todoId, attachmentId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        "uploadUrl": url
      })
    }    

    return undefined
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
