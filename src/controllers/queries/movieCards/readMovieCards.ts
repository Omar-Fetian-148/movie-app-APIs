import { GraphQLError } from 'graphql'
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'
import { MovieCard, SearchHistory } from "../../../data/models/index.js";
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

    if (typeof searchInput === 'string' && searchInput.length >= 2) {
      let historyGenres = new Set<(typeof Genre)[number]>()
      for (const card of movieCards) {
        card.genre.forEach(genre => historyGenres.add(genre));
      }


      const updateGenresObject: { [key: string]: number } = {};
      historyGenres.forEach((genre) => {
        updateGenresObject[`genres.${genre}`] = 1;
      });

      const searchHistory = await SearchHistory.findOneAndUpdate(
        { userId: new Types.ObjectId(user._id) },
        {
          $inc: updateGenresObject
        },
        { upsert: true, new: true }
      );

      await searchHistory.save();
    }

    return responseHandler.mutationSuccessResponse('successfulOperation', data)

  } catch (error) {
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
}
