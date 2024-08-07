import { GraphQLError } from 'graphql'
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'
import { MovieCard } from "../../../data/models/index.js";
import { Types } from "mongoose";
import { MovieCardType } from "../../../data/interfaces/index.js";
import Redis from "../../../config/redis.js";

export default async (
  _: undefined,
  {
    movieCardId
  }: {
    movieCardId: Types.ObjectId
  },
  { language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)
  try {

    const cachedMovieCardData = await Redis.getCache(`movieCard:${movieCardId}`);

    if (cachedMovieCardData) {
      return responseHandler.mutationSuccessResponse('successfulOperation', cachedMovieCardData)
    }

    const movieCard = await MovieCard.findById(movieCardId) as MovieCardType

    await Redis.setCache(`movieCard:${movieCardId}`, movieCard, 10 * 60);

    return responseHandler.mutationSuccessResponse('successfulOperation', movieCard)

  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}
