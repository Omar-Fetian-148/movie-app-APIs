import { GraphQLError } from 'graphql'
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'
import { Bookmark } from "../../../data/models/index.js";
import { Genre, MovieCardType } from "../../../data/interfaces/index.js";
import { Types } from "mongoose";

type ReadMovieCardsInput = {
  page?: number
  searchInput?: string
  year?: number
  genre?: (typeof Genre)[number]
  IMDbRating?: number
}
export default async (
  _: undefined,
  {
    page, IMDbRating, genre, searchInput, year
  }: ReadMovieCardsInput,
  { user, language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)
  try {
    if (!user) return responseHandler.generateError('unauthorized')

    if (!page || page < 0) page = 1

    const viewLimit = 10;

    const skip = (page - 1) * viewLimit;

    const matchStage = {
      ...(searchInput && {
        $or: [
          { name: { $regex: searchInput, $options: 'i' } },
        ],
      }),

      ...(IMDbRating && {
        IMDbRating: {
          $gte: IMDbRating,
        }
      }),

      ...(genre && { genre }),
      ...(year && { year }),

    }
    const pipeLine = [
      {
        $facet: {
          movieCards: [
            {
              $match: {
                userId: new Types.ObjectId(user?._id)
              }
            },
            {
              $lookup: {
                from: 'moviecards',
                localField: 'movieCardId',
                foreignField: '_id',
                as: 'result'
              }
            },
            {
              $unwind: {
                path: '$result',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $replaceRoot: { newRoot: "$result" }
            },
            {
              $match: matchStage
            },
            {
              $skip: skip,
            },
            {
              $limit: viewLimit,
            },
          ],
          totalCount: [
            {
              $match: {
                userId: new Types.ObjectId(user?._id)
              }
            },
            {
              $lookup: {
                from: 'moviecards',
                localField: 'movieCardId',
                foreignField: '_id',
                as: 'result'
              }
            },
            {
              $unwind: {
                path: '$result',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $replaceRoot: { newRoot: "$result" }
            },
            {
              $match: matchStage
            },
            {
              $count: 'count'
            }
          ]
        }
      }
    ]

    const result = await Bookmark.aggregate(pipeLine)
    const movieCards: MovieCardType[] = result[0].movieCards ?? []
    const count: number = result[0]?.totalCount[0]?.count ?? 0

    let data = {
      list: movieCards,
      pagination: {
        totalDocuments: count,
        viewLimit,
      },
    };

    return responseHandler.mutationSuccessResponse('successfulOperation', data)

  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}
