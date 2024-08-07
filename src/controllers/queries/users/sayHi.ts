import { GraphQLError } from 'graphql'
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'

import Redis from "../../../config/redis.js";


export default async (
  _: undefined,
  __: undefined,
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)
  try {
    let data = {
      code: 200,
      message: 'Post is Created successfully.',
      success: true,
      data: 'hi',
    }

    await Redis.pubsub.publish('SAY_HELLO', { sayHello: data });

    return responseHandler.mutationSuccessResponse<string>('successfulOperation', 'hi');

  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}
