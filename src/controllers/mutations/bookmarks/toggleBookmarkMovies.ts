import { GraphQLError } from 'graphql'
import { Types } from "mongoose";
import { MovieCard, Bookmark } from "../../../data/models/index.js";
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'

export default async (
  _: undefined,
  { movieCardId }: { movieCardId: Types.ObjectId },
  { user, language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language);
  try {
    if (!user) return responseHandler.generateError('unauthorized')
    let movieCard = await MovieCard.findById(movieCardId)
    if (!movieCard) return responseHandler.generateError('checkYourInput')

    const isBookmarked = await Bookmark.findOneAndDelete({
      movieCardId: new Types.ObjectId(movieCardId),
      userId: new Types.ObjectId(user?._id),
    })

    if (!isBookmarked) {
      await Bookmark.create({
        movieCardId: new Types.ObjectId(movieCardId),
        userId: new Types.ObjectId(user?._id),
      })
    }

    return responseHandler.mutationSuccessResponse('successfulOperation');

  } catch (error) {
    console.error('Error saving movie card:', error);
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
};
