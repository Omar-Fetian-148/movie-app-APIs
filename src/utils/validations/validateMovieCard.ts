import Joi from 'joi';
import { Genre } from '../../data/interfaces/index.js'; 


// Define the MovieCardInput schema
const movieCardInputSchema = Joi.object({
  name: Joi.string().required(),
  director: Joi.string().required(),
  storyline: Joi.string().required(),
  IMDbRating: Joi.number().min(0).max(10).required(),
  cast: Joi.array().items(Joi.string()).required(),
  trailerUrl: Joi.string().uri().required(),
  genre: Joi.array().items(Joi.string().valid(...Genre)).required(),
  year: Joi.number().integer().min(1888).required()
});

export default movieCardInputSchema
