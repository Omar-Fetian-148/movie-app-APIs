import { GraphQLError } from 'graphql'
import { ResponseHandler } from '../../../utils/helpers.js'
import { MyContext } from '../../../utils/auth.js'
import { MovieCard } from "../../../data/models/index.js";
import { MovieCardInput } from "../../../data/interfaces/index.js";
import generateUrl from "../../../utils/generateUrl.js";
import validateMovieCard from "../../../utils/validations/validateMovieCard.js";

export default async (
  _: undefined,
  {
    director, IMDbRating, cast, genre, name, storyline, picture, trailerUrl, year
  }: MovieCardInput,
  { user, language }: MyContext
) => {
  const responseHandler = new ResponseHandler(language);
  try {
    if (!user) return responseHandler.generateError('unauthorized')
    if (user.role !== 'ADMIN') return responseHandler.generateError('unauthorized')

    const { error } = validateMovieCard.validate(
      {
        director, IMDbRating, cast, genre, name, storyline, trailerUrl, year
      },
      { abortEarly: false }
    );

    if (error) throw new Error(error.details.map((x) => x.message).join(', '));

    const movieCard = new MovieCard({
      director, IMDbRating, cast, genre, name, storyline, year, trailerUrl
    });

    if (picture) {
      try {
        const { createReadStream } = await picture.promise;
        const stream = createReadStream();
        movieCard.pictureUrl = await generateUrl(stream, language, 'MoviePictures');
      } catch (error) {
        console.error('Error uploading picture:', error);
        throw new Error('Failed to upload picture');
      }
    }

    await movieCard.save();

    return responseHandler.mutationSuccessResponse('successfulOperation');

  } catch (error) {
    console.error('Error saving movie card:', error);
    return responseHandler.mutationFailResponse(error as GraphQLError);
  }
};
