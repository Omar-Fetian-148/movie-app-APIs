import { model, Schema, Document } from 'mongoose';
import { Genre, MovieCardType } from "../../interfaces/index.js";

type TMovieCard = MovieCardType & Document

const movieCardSchema = new Schema<TMovieCard>({
  name: {
    type: String,
    required: true,
    trim: true,
    // minlength: 2,
  },
  IMDbRating: {
    type: Number,
    required: true
  },
  Director: {
    type: String,
    required: true,
    trim: true,
    // minlength: 2,
  },
  storyline: {
    type: String,
    required: true,
    trim: true,
    // minlength: 10,
  },
  cast: [
    {
      type: String,
      required: true,
      trim: true,
      // minlength: 2,
    }
  ],
  pictureUrl: {
    type: String,
    // required: true,
  },
  trailerUrl: {
    type: String,
    // required: true,
  },
  genre: [
    {
      type: String,
      enum: Genre,
      required: true,
      trim: true,
    }
  ],
  year: {
    type: Number,
    required: true,
    min: 1888, // First film created in 1888
    max: new Date().getFullYear(), // Current year
  }
}, { timestamps: true }
)

export default model<TMovieCard>('MovieCard', movieCardSchema);
