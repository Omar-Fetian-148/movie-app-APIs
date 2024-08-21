import { GraphQLError } from 'graphql'
import { ResponseHandler, getTopGenres } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'
import { MovieCard, SearchHistory, Bookmark } from "../../../data/models/index.js";
import { Genre, MovieCardType } from "../../../data/interfaces/index.js";
import { Types } from "mongoose";

type GenreType = (typeof Genre)[number]

export default async (
  _: undefined,
  { page }: { page: number },
  { user, language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language)
  try {
    if (!user) return responseHandler.generateError('unauthorized')

    if (!page || page < 0) page = 1

    const viewLimit = 10;

    const skip = (page - 1) * viewLimit;

    const resultData = await SearchHistory.findOne({ userId: new Types.ObjectId(user._id) }).lean() //.lean() to convert it to Js object
    let historicalGenres = resultData?.genres
    const getTop5Genres = getTopGenres(historicalGenres, 5)

    const bookmarkedGenresPipeline = [
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
        $project: { genre: 1 }  // Keep only the `tags` field
      },
      {
        $unwind: "$genre"  // Deconstruct the `tags` array
      },
      {
        $group: {
          _id: null,
          concatenatedTags: { $push: "$genre" }  // Collect all tags into an array
        }
      },
      {
        $project: {
          _id: 0,
          concatenatedTags: 1
        }
      }
    ]

    const userBookmarksResult = await Bookmark.aggregate(bookmarkedGenresPipeline)
    const userBookmarks: GenreType = userBookmarksResult[0]?.concatenatedTags ? userBookmarksResult[0]?.concatenatedTags : []

    const concatenatedGenres = [...getTop5Genres, ...userBookmarks] as GenreType[]
    let userFavGenres = [...new Set(concatenatedGenres)];

    if (userFavGenres.length === 0) userFavGenres = ['ACTION', 'DRAMA']

    const matchStage = {
      genre: { $in: userFavGenres }
    }

    const pipeLine = [
      {
        $facet: {
          movieCards: [
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
              $match: matchStage
            },
            {
              $count: 'count'
            }
          ]
        }
      }
    ]

    const result = await MovieCard.aggregate(pipeLine)
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
